"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurtleAIStack = void 0;
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const cdk = __importStar(require("aws-cdk-lib"));
const Constants = __importStar(require("../src/utils/constants"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const lambdaNodejs = __importStar(require("aws-cdk-lib/aws-lambda-nodejs"));
const pinpoint = __importStar(require("aws-cdk-lib/aws-pinpoint"));
const sns = __importStar(require("aws-cdk-lib/aws-sns"));
const snsSubscriptions = __importStar(require("aws-cdk-lib/aws-sns-subscriptions"));
const applicationId = Constants.PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION;
class TurtleAIStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const snsLoggingRole = new iam.Role(this, 'SnsLoggingRole', {
            assumedBy: new iam.ServicePrincipal('sns.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
            ],
        });
        // Define the SNS Publish Policy
        const snsPublishPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['sns:Publish'],
            resources: ['*'], // It's better to specify the exact ARN of the SNS topic if possible
        });
        // Create SNS Topic for AdminAlerts
        const snsTopicAdminAlerts = new sns.Topic(this, 'TurtleAI-ContactSNSTopic-AdminAlerts', {
            displayName: 'TurtleAI-ContactSNSTopic-AdminAlerts',
            topicName: 'TurtleAI-ContactSNSTopic-AdminAlerts' // Explicit physical name
        });
        // Create SNS Topic for ContactVerification
        const snsTopicContactVerification = new sns.Topic(this, 'TurtleAI-ContactSNSTopic-ContactVerification', {
            displayName: 'TurtleAI-ContactSNSTopic-ContactVerification',
            topicName: 'TurtleAI-ContactSNSTopic-ContactVerification'
        });
        // Define DynamoDB table for contacts
        const tenTenUserTable = new dynamodb.Table(this, 'TenTenUsersTable', {
            partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
            tableName: Constants.TEN_TEN_USERS_TABLE,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
        });
        // Define DynamoDB table for contacts
        const tenTenEmployeeTable = new dynamodb.Table(this, 'TenTenEmployeeTable', {
            partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
            tableName: Constants.TEN_TEN_EMPLOYEES_TABLE,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
        });
        // Adding a Global Secondary Index (GSI) for 'managerId'
        tenTenEmployeeTable.addGlobalSecondaryIndex({
            indexName: 'ManagerIdIndex',
            partitionKey: { name: 'managerId', type: dynamodb.AttributeType.STRING },
            // You can include 'name' and 'email' as non-key attributes if you need to return these attributes in your query results
            projectionType: dynamodb.ProjectionType.INCLUDE,
            nonKeyAttributes: ['name', 'email']
        });
        // Define DynamoDB table for Projects
        const tenTenProjectTable = new dynamodb.Table(this, 'TenTenProjectTable', {
            partitionKey: { name: 'projectid', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
            tableName: Constants.TEN_TEN_PROJECTS_TABLE,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
        });
        // Define DynamoDB table for Project Tasks
        const tenTenTasksTable = new dynamodb.Table(this, 'TenTenTasksTable', {
            partitionKey: { name: 'taskid', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
            tableName: Constants.TEN_TEN_TASKS_TABLE,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
        });
        // Adding a Global Secondary Index (GSI) for 'projectid'
        tenTenTasksTable.addGlobalSecondaryIndex({
            indexName: 'ProjectIdIndex',
            partitionKey: { name: 'projectid', type: dynamodb.AttributeType.STRING },
            // You can include 'name' and 'email' as non-key attributes if you need to return these attributes in your query results
            projectionType: dynamodb.ProjectionType.INCLUDE,
            nonKeyAttributes: ['name', 'taskid']
        });
        // Create IAM Role
        const lambdaRole = new iam.Role(this, 'LambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            roleName: Constants.LAMBDA_ROLE,
            description: 'Role for Lambda with logging, DynamoDB and SNS permissions',
        });
        // Attach policies to the role
        // CloudWatch logs policy
        lambdaRole.addToPolicy(new iam.PolicyStatement({
            actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            resources: ['arn:aws:logs:*:*:*'],
        }));
        // DynamoDB read/write policy
        lambdaRole.addToPolicy(new iam.PolicyStatement({
            actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem', 'dynamodb:Scan', 'dynamodb:Query'],
            resources: [Constants.TEN_TEN_EMPLOYEES_TABLE, Constants.TEN_TEN_JOURNAL_TABLE, Constants.TEN_TEN_PROJECTS_TABLE, Constants.TEN_TEN_TASKS_TABLE, Constants.TEN_TEN_USERS_TABLE], // Replace with your DynamoDB table ARN
        }));
        // SNS publish policy
        lambdaRole.addToPolicy(new iam.PolicyStatement({
            actions: ['sns:Publish'],
            resources: ['*'], // Replace with your SNS topic ARN
        }));
        // S3 read/write policy
        lambdaRole.addToPolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['arn:aws:s3:::bulk-upload-contacts/*', 'arn:aws:s3:::bulk-upload-contacts']
        }));
        // Create Lambda function for creating contacts
        const createContactLambda = new lambdaNodejs.NodejsFunction(this, 'CreateContactFunction', {
            entry: 'src/lambda/create-user.ts',
            handler: 'createContactHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: tenTenUserTable.tableName,
            },
            role: lambdaRole,
            timeout: cdk.Duration.minutes(5),
            functionName: Constants.CREATE_CONTACTS_LAMBDA
        });
        createContactLambda.addToRolePolicy(snsPublishPolicy);
        // Grant permissions to access DynamoDB
        tenTenUserTable.grantReadWriteData(createContactLambda);
        // Allow Lambda to publish to the SNS Topic
        snsTopicAdminAlerts.grantPublish(createContactLambda);
        snsTopicContactVerification.grantPublish(createContactLambda);
        // Create Lambda function for uploading the CSV into the contacts
        const bulkCreateContactLambda = new lambdaNodejs.NodejsFunction(this, 'BulkCreateContactFunction', {
            entry: 'src/lambda/create-user.ts',
            handler: 'bulkCreateContactHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: tenTenUserTable.tableName,
            },
            role: lambdaRole,
            timeout: cdk.Duration.minutes(5),
            functionName: Constants.BULK_CREATE_CONTACTS_LAMBDA
        });
        // Grant permissions to access DynamoDB
        tenTenUserTable.grantReadWriteData(bulkCreateContactLambda);
        // Create Lambda function for getting contacts
        const getContactLambda = new lambdaNodejs.NodejsFunction(this, 'GetContactFunction', {
            entry: 'src/lambda/get-contacts.ts',
            handler: 'retrieveContactHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: tenTenUserTable.tableName,
            },
            functionName: Constants.RETRIEVE_CONTACTS_LAMBDA
        });
        // Grant permissions to access DynamoDB
        tenTenUserTable.grantReadData(getContactLambda);
        // Create Lambda function for updating contacts
        const updateContactLambda = new lambdaNodejs.NodejsFunction(this, 'UpdateContactFunction', {
            entry: 'src/lambda/update-contact.ts',
            handler: 'updateContactHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: tenTenUserTable.tableName,
            },
            functionName: Constants.UPDATE_CONTACTS_LAMBDA
        });
        // Grant permissions to access DynamoDB
        tenTenUserTable.grantReadWriteData(updateContactLambda);
        // Create Lambda function for updating subscriptions
        const updateContactSubscriptionsLambda = new lambdaNodejs.NodejsFunction(this, 'UpdateContactSubscriptionsFunction', {
            entry: 'src/lambda/update-contact-subscriptions.ts',
            handler: 'updateContactSubscriptionsHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: tenTenUserTable.tableName,
            },
            functionName: Constants.UPDATE_CONTACT_SUBSCRIPTION_LAMBDA
        });
        // Grant permissions to access DynamoDB
        tenTenUserTable.grantReadWriteData(updateContactSubscriptionsLambda);
        // Create Lambda function for updating subscriptions
        const UnSubscribeLambda = new lambdaNodejs.NodejsFunction(this, 'ContactsUnsubscribeFunction', {
            entry: 'src/lambda/unsubscribe.ts',
            handler: 'unSubscribeHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: tenTenUserTable.tableName,
            },
            functionName: "UnSubscribeLambda"
        });
        // Grant permissions to access DynamoDB
        tenTenUserTable.grantReadWriteData(UnSubscribeLambda);
        // Create a Lambda function for handling SNS messages (optional)
        const adminAlertSnsHandlerLambda = new lambdaNodejs.NodejsFunction(this, 'AdminAlertSNSHandlerFunction', {
            entry: 'src/lambda/admin-alert-sns-handler.ts',
            handler: 'adminAlertSnsHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            functionName: 'AdminAlertsLambda',
            environment: {
                ADMIN_EMAILS: 'malhotra.vikas@gmail.com'
            },
        });
        tenTenUserTable.grantReadWriteData(adminAlertSnsHandlerLambda);
        // Subscribe the Lambda to the SNS Topic (optional)
        snsTopicAdminAlerts.addSubscription(new snsSubscriptions.LambdaSubscription(adminAlertSnsHandlerLambda));
        // Create a Lambda function for handling SNS messages (optional)
        const contactVerificationSnsHandlerLambda = new lambdaNodejs.NodejsFunction(this, 'ContactVerificationSNSHandlerFunction', {
            entry: 'src/lambda/contact-verification-sns-handler.ts',
            handler: 'contactVerificationSnsHandler',
            runtime: lambda.Runtime.NODEJS_18_X,
            functionName: 'ContactVerificationLambda'
        });
        tenTenUserTable.grantReadWriteData(contactVerificationSnsHandlerLambda);
        // Subscribe the Lambda to the SNS Topic (optional)
        snsTopicContactVerification.addSubscription(new snsSubscriptions.LambdaSubscription(contactVerificationSnsHandlerLambda));
        // Create API Gateway
        const api = new apigateway.RestApi(this, 'TurtleAI-contact-api', {
            deployOptions: {
                stageName: 'v1',
            },
        });
        const contactsResource = api.root.addResource('contacts');
        const subscriptionsResource = api.root.addResource('lists');
        const unsubscribeResource = api.root.addResource('unsubscribe');
        // Add POST method to create contacts
        const createContactIntegration = new apigateway.LambdaIntegration(createContactLambda);
        contactsResource.addMethod('POST', createContactIntegration);
        // Add GET method to retrieve contacts
        const getContactIntegration = new apigateway.LambdaIntegration(getContactLambda);
        contactsResource.addMethod('GET', getContactIntegration);
        // Add PUT method to update contacts
        const updateContactIntegration = new apigateway.LambdaIntegration(updateContactLambda);
        contactsResource.addMethod('PUT', updateContactIntegration);
        // Add POST and DELETE method to update contacts subscription
        const updateContactSubscriptionsIntegration = new apigateway.LambdaIntegration(updateContactSubscriptionsLambda);
        subscriptionsResource.addMethod('POST', updateContactSubscriptionsIntegration);
        subscriptionsResource.addMethod('DELETE', updateContactSubscriptionsIntegration);
        // Add POST method to unsubscribe contacts
        const contactUnSubscriptionsIntegration = new apigateway.LambdaIntegration(UnSubscribeLambda);
        unsubscribeResource.addMethod('POST', contactUnSubscriptionsIntegration);
        // Give the lambda function access to AWS Pinpoint
        const pinpointAccessPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['mobiletargeting:*'],
            resources: ['*'],
        });
        createContactLambda.addToRolePolicy(pinpointAccessPolicy);
        adminAlertSnsHandlerLambda.addToRolePolicy(pinpointAccessPolicy);
        updateContactLambda.addToRolePolicy(pinpointAccessPolicy);
        // IAM Policy to send emails using SES
        const sesSendEmailPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['ses:SendEmail', 'ses:SendRawEmail'],
            resources: ['*'],
        });
        //pinpointMessagingLambda.addToRolePolicy(sesSendEmailPolicy)
        adminAlertSnsHandlerLambda.addToRolePolicy(sesSendEmailPolicy);
        const marketingSegmentDimensions = {
            userAttributes: {
                lists: {
                    Values: ['marketing']
                }
            }
        };
        const marketingSegment = new pinpoint.CfnSegment(this, 'MarketingSegment', {
            applicationId: applicationId,
            name: "marketing",
            dimensions: marketingSegmentDimensions
        });
        new cdk.CfnOutput(this, 'marketingSegment', { value: marketingSegment.attrArn.toString() });
        const clinicalSegmentDimensions = {
            userAttributes: {
                lists: {
                    Values: ['clinical']
                }
            }
        };
        const clinicalSegment = new pinpoint.CfnSegment(this, 'ClinicalSegment', {
            applicationId: applicationId,
            name: "clinical",
            dimensions: clinicalSegmentDimensions
        });
        new cdk.CfnOutput(this, 'clinicalSegment', { value: clinicalSegment.attrArn.toString() });
        // Output the API endpoint URL
        new cdk.CfnOutput(this, 'ApiEndpoint', {
            value: api.url,
        });
    }
}
exports.TurtleAIStack = TurtleAIStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVydGxlQUktc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvVHVydGxlQUktc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSx1RUFBd0Q7QUFDeEQsaURBQWtDO0FBQ2xDLGtFQUFtRDtBQUNuRCxtRUFBb0Q7QUFDcEQseURBQTBDO0FBQzFDLCtEQUFnRDtBQUNoRCw0RUFBNkQ7QUFDN0QsbUVBQW9EO0FBQ3BELHlEQUEwQztBQUMxQyxvRkFBcUU7QUFFckUsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLDJDQUEyQyxDQUFBO0FBRTNFLE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFdkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUMxRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7WUFDeEQsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsMENBQTBDLENBQUM7YUFDdkY7U0FDRixDQUFDLENBQUE7UUFFRixnQ0FBZ0M7UUFDaEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDL0MsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN4QixPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDeEIsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsb0VBQW9FO1NBQ3ZGLENBQUMsQ0FBQTtRQUVGLG1DQUFtQztRQUNuQyxNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLEtBQUss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QUksRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRTNGLE1BQU0seUJBQXlCLEdBQWtEO1lBQy9FLGNBQWMsRUFBRTtnQkFDZCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQTtRQUVELE1BQU0sZUFBZSxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDdkUsYUFBYSxFQUFFLGFBQWE7WUFDNUIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFLHlCQUF5QjtTQUN0QyxDQUFDLENBQUE7UUFFRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRXpGLDhCQUE4QjtRQUM5QixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFyVUQsc0NBcVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cydcblxuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSdcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCAqIGFzIENvbnN0YW50cyBmcm9tICcuLi9zcmMvdXRpbHMvY29uc3RhbnRzJ1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJ1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIGxhbWJkYU5vZGVqcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcydcbmltcG9ydCAqIGFzIHBpbnBvaW50IGZyb20gJ2F3cy1jZGstbGliL2F3cy1waW5wb2ludCdcbmltcG9ydCAqIGFzIHNucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJ1xuaW1wb3J0ICogYXMgc25zU3Vic2NyaXB0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnXG5cbmNvbnN0IGFwcGxpY2F0aW9uSWQgPSBDb25zdGFudHMuUElOUE9JTlRfQ09OVEFDVF9DT01NVU5JQ0FUSU9OU19BUFBMSUNBVElPTlxuXG5leHBvcnQgY2xhc3MgVHVydGxlQUlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKVxuXG4gICAgY29uc3Qgc25zTG9nZ2luZ1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1Nuc0xvZ2dpbmdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJylcbiAgICAgIF0sXG4gICAgfSlcblxuICAgIC8vIERlZmluZSB0aGUgU05TIFB1Ymxpc2ggUG9saWN5XG4gICAgY29uc3Qgc25zUHVibGlzaFBvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFsnc25zOlB1Ymxpc2gnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sIC8vIEl0J3MgYmV0dGVyIHRvIHNwZWNpZnkgdGhlIGV4YWN0IEFSTiBvZiB0aGUgU05TIHRvcGljIGlmIHBvc3NpYmxlXG4gICAgfSlcblxuICAgIC8vIENyZWF0ZSBTTlMgVG9waWMgZm9yIEFkbWluQWxlcnRzXG4gICAgY29uc3Qgc25zVG9waWNBZG1pbkFsZXJ0cyA9IG5ldyBzbnMuVG9waWModGhpcywgJ1R1cnRsZUFJLUNvbnRhY3RTTlNUb3BpYy1BZG1pbkFsZXJ0cycsIHtcbiAgICAgIGRpc3BsYXlOYW1lOiAnVHVydGxlQUktQ29udGFjdFNOU1RvcGljLUFkbWluQWxlcnRzJyxcbiAgICAgIHRvcGljTmFtZTogJ1R1cnRsZUFJLUNvbnRhY3RTTlNUb3BpYy1BZG1pbkFsZXJ0cycgLy8gRXhwbGljaXQgcGh5c2ljYWwgbmFtZVxuICAgIH0pXG5cbiAgICAvLyBDcmVhdGUgU05TIFRvcGljIGZvciBDb250YWN0VmVyaWZpY2F0aW9uXG4gICAgY29uc3Qgc25zVG9waWNDb250YWN0VmVyaWZpY2F0aW9uID0gbmV3IHNucy5Ub3BpYyh0aGlzLCAnVHVydGxlQUktQ29udGFjdFNOU1RvcGljLUNvbnRhY3RWZXJpZmljYXRpb24nLCB7XG4gICAgICBkaXNwbGF5TmFtZTogJ1R1cnRsZUFJLUNvbnRhY3RTTlNUb3BpYy1Db250YWN0VmVyaWZpY2F0aW9uJyxcbiAgICAgIHRvcGljTmFtZTogJ1R1cnRsZUFJLUNvbnRhY3RTTlNUb3BpYy1Db250YWN0VmVyaWZpY2F0aW9uJ1xuICAgIH0pXG5cbiAgICAvLyBEZWZpbmUgRHluYW1vREIgdGFibGUgZm9yIGNvbnRhY3RzXG4gICAgY29uc3QgdGVuVGVuVXNlclRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdUZW5UZW5Vc2Vyc1RhYmxlJywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdlbWFpbCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICBzb3J0S2V5OiB7IG5hbWU6ICduYW1lJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgIHRhYmxlTmFtZTogQ29uc3RhbnRzLlRFTl9URU5fVVNFUlNfVEFCTEUsXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULCAvLyBVc2UgT24tRGVtYW5kIGJpbGxpbmcgbW9kZVxuICAgIH0pXG5cbiAgICAvLyBEZWZpbmUgRHluYW1vREIgdGFibGUgZm9yIGNvbnRhY3RzXG4gICAgY29uc3QgdGVuVGVuRW1wbG95ZWVUYWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnVGVuVGVuRW1wbG95ZWVUYWJsZScsIHtcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnZW1haWwnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgc29ydEtleTogeyBuYW1lOiAnbmFtZScsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICB0YWJsZU5hbWU6IENvbnN0YW50cy5URU5fVEVOX0VNUExPWUVFU19UQUJMRSxcbiAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsIC8vIFVzZSBPbi1EZW1hbmQgYmlsbGluZyBtb2RlXG4gICAgfSlcbiAgICAvLyBBZGRpbmcgYSBHbG9iYWwgU2Vjb25kYXJ5IEluZGV4IChHU0kpIGZvciAnbWFuYWdlcklkJ1xuICAgIHRlblRlbkVtcGxveWVlVGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoe1xuICAgICAgaW5kZXhOYW1lOiAnTWFuYWdlcklkSW5kZXgnLFxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdtYW5hZ2VySWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgLy8gWW91IGNhbiBpbmNsdWRlICduYW1lJyBhbmQgJ2VtYWlsJyBhcyBub24ta2V5IGF0dHJpYnV0ZXMgaWYgeW91IG5lZWQgdG8gcmV0dXJuIHRoZXNlIGF0dHJpYnV0ZXMgaW4geW91ciBxdWVyeSByZXN1bHRzXG4gICAgICBwcm9qZWN0aW9uVHlwZTogZHluYW1vZGIuUHJvamVjdGlvblR5cGUuSU5DTFVERSxcbiAgICAgIG5vbktleUF0dHJpYnV0ZXM6IFsnbmFtZScsICdlbWFpbCddXG4gICAgfSk7XG5cbiAgICAvLyBEZWZpbmUgRHluYW1vREIgdGFibGUgZm9yIFByb2plY3RzXG4gICAgY29uc3QgdGVuVGVuUHJvamVjdFRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdUZW5UZW5Qcm9qZWN0VGFibGUnLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ3Byb2plY3RpZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICBzb3J0S2V5OiB7IG5hbWU6ICduYW1lJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgIHRhYmxlTmFtZTogQ29uc3RhbnRzLlRFTl9URU5fUFJPSkVDVFNfVEFCTEUsXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULCAvLyBVc2UgT24tRGVtYW5kIGJpbGxpbmcgbW9kZVxuICAgIH0pXG5cbiAgICAvLyBEZWZpbmUgRHluYW1vREIgdGFibGUgZm9yIFByb2plY3QgVGFza3NcbiAgICBjb25zdCB0ZW5UZW5UYXNrc1RhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdUZW5UZW5UYXNrc1RhYmxlJywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICd0YXNraWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgc29ydEtleTogeyBuYW1lOiAnbmFtZScsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICB0YWJsZU5hbWU6IENvbnN0YW50cy5URU5fVEVOX1RBU0tTX1RBQkxFLFxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCwgLy8gVXNlIE9uLURlbWFuZCBiaWxsaW5nIG1vZGVcbiAgICB9KVxuICAgIC8vIEFkZGluZyBhIEdsb2JhbCBTZWNvbmRhcnkgSW5kZXggKEdTSSkgZm9yICdwcm9qZWN0aWQnXG4gICAgdGVuVGVuVGFza3NUYWJsZS5hZGRHbG9iYWxTZWNvbmRhcnlJbmRleCh7XG4gICAgICBpbmRleE5hbWU6ICdQcm9qZWN0SWRJbmRleCcsXG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ3Byb2plY3RpZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICAvLyBZb3UgY2FuIGluY2x1ZGUgJ25hbWUnIGFuZCAnZW1haWwnIGFzIG5vbi1rZXkgYXR0cmlidXRlcyBpZiB5b3UgbmVlZCB0byByZXR1cm4gdGhlc2UgYXR0cmlidXRlcyBpbiB5b3VyIHF1ZXJ5IHJlc3VsdHNcbiAgICAgIHByb2plY3Rpb25UeXBlOiBkeW5hbW9kYi5Qcm9qZWN0aW9uVHlwZS5JTkNMVURFLFxuICAgICAgbm9uS2V5QXR0cmlidXRlczogWyduYW1lJywgJ3Rhc2tpZCddXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgSUFNIFJvbGVcbiAgICBjb25zdCBsYW1iZGFSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdMYW1iZGFSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICByb2xlTmFtZTogQ29uc3RhbnRzLkxBTUJEQV9ST0xFLFxuICAgICAgZGVzY3JpcHRpb246ICdSb2xlIGZvciBMYW1iZGEgd2l0aCBsb2dnaW5nLCBEeW5hbW9EQiBhbmQgU05TIHBlcm1pc3Npb25zJyxcbiAgICB9KVxuXG4gICAgLy8gQXR0YWNoIHBvbGljaWVzIHRvIHRoZSByb2xlXG5cbiAgICAvLyBDbG91ZFdhdGNoIGxvZ3MgcG9saWN5XG4gICAgbGFtYmRhUm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2xvZ3M6Q3JlYXRlTG9nR3JvdXAnLCAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLCAnbG9nczpQdXRMb2dFdmVudHMnXSxcbiAgICAgIHJlc291cmNlczogWydhcm46YXdzOmxvZ3M6KjoqOionXSxcbiAgICB9KSlcblxuICAgIC8vIER5bmFtb0RCIHJlYWQvd3JpdGUgcG9saWN5XG4gICAgbGFtYmRhUm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2R5bmFtb2RiOkdldEl0ZW0nLCAnZHluYW1vZGI6UHV0SXRlbScsICdkeW5hbW9kYjpVcGRhdGVJdGVtJywgJ2R5bmFtb2RiOkRlbGV0ZUl0ZW0nLCAnZHluYW1vZGI6U2NhbicsICdkeW5hbW9kYjpRdWVyeSddLFxuICAgICAgcmVzb3VyY2VzOiBbQ29uc3RhbnRzLlRFTl9URU5fRU1QTE9ZRUVTX1RBQkxFLCBDb25zdGFudHMuVEVOX1RFTl9KT1VSTkFMX1RBQkxFLCBDb25zdGFudHMuVEVOX1RFTl9QUk9KRUNUU19UQUJMRSwgQ29uc3RhbnRzLlRFTl9URU5fVEFTS1NfVEFCTEUsIENvbnN0YW50cy5URU5fVEVOX1VTRVJTX1RBQkxFXSwgLy8gUmVwbGFjZSB3aXRoIHlvdXIgRHluYW1vREIgdGFibGUgQVJOXG4gICAgfSkpXG5cbiAgICAvLyBTTlMgcHVibGlzaCBwb2xpY3lcbiAgICBsYW1iZGFSb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnc25zOlB1Ymxpc2gnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sIC8vIFJlcGxhY2Ugd2l0aCB5b3VyIFNOUyB0b3BpYyBBUk5cbiAgICB9KSlcblxuICAgIC8vIFMzIHJlYWQvd3JpdGUgcG9saWN5XG4gICAgbGFtYmRhUm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCcsICdzMzpMaXN0QnVja2V0J10sXG4gICAgICByZXNvdXJjZXM6IFsnYXJuOmF3czpzMzo6OmJ1bGstdXBsb2FkLWNvbnRhY3RzLyonLCAnYXJuOmF3czpzMzo6OmJ1bGstdXBsb2FkLWNvbnRhY3RzJ11cbiAgICB9KSlcblxuICAgIC8vIENyZWF0ZSBMYW1iZGEgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGNvbnRhY3RzXG4gICAgY29uc3QgY3JlYXRlQ29udGFjdExhbWJkYSA9IG5ldyBsYW1iZGFOb2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgJ0NyZWF0ZUNvbnRhY3RGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiAnc3JjL2xhbWJkYS9jcmVhdGUtY29udGFjdC50cycsIC8vIFBhdGggdG8geW91ciBMYW1iZGEgY29kZVxuICAgICAgaGFuZGxlcjogJ2NyZWF0ZUNvbnRhY3RIYW5kbGVyJywgLy8gVGhlIGV4cG9ydGVkIGZ1bmN0aW9uIG5hbWUgZm9yIGNyZWF0aW5nIGNvbnRhY3RzXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHRlblRlblVzZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgICAgcm9sZTogbGFtYmRhUm9sZSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgZnVuY3Rpb25OYW1lOiBDb25zdGFudHMuQ1JFQVRFX0NPTlRBQ1RTX0xBTUJEQVxuICAgIH0pXG5cbiAgICBjcmVhdGVDb250YWN0TGFtYmRhLmFkZFRvUm9sZVBvbGljeShzbnNQdWJsaXNoUG9saWN5KVxuXG4gICAgLy8gR3JhbnQgcGVybWlzc2lvbnMgdG8gYWNjZXNzIER5bmFtb0RCXG4gICAgdGVuVGVuVXNlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShjcmVhdGVDb250YWN0TGFtYmRhKVxuXG4gICAgLy8gQWxsb3cgTGFtYmRhIHRvIHB1Ymxpc2ggdG8gdGhlIFNOUyBUb3BpY1xuICAgIHNuc1RvcGljQWRtaW5BbGVydHMuZ3JhbnRQdWJsaXNoKGNyZWF0ZUNvbnRhY3RMYW1iZGEpXG4gICAgc25zVG9waWNDb250YWN0VmVyaWZpY2F0aW9uLmdyYW50UHVibGlzaChjcmVhdGVDb250YWN0TGFtYmRhKVxuXG4gICAgLy8gQ3JlYXRlIExhbWJkYSBmdW5jdGlvbiBmb3IgdXBsb2FkaW5nIHRoZSBDU1YgaW50byB0aGUgY29udGFjdHNcbiAgICBjb25zdCBidWxrQ3JlYXRlQ29udGFjdExhbWJkYSA9IG5ldyBsYW1iZGFOb2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgJ0J1bGtDcmVhdGVDb250YWN0RnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogJ3NyYy9sYW1iZGEvYnVsay1jcmVhdGUtY29udGFjdC50cycsIC8vIFBhdGggdG8geW91ciBMYW1iZGEgY29kZVxuICAgICAgaGFuZGxlcjogJ2J1bGtDcmVhdGVDb250YWN0SGFuZGxlcicsIC8vIFRoZSBleHBvcnRlZCBmdW5jdGlvbiBuYW1lIGZvciBjcmVhdGluZyBjb250YWN0c1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiB0ZW5UZW5Vc2VyVGFibGUudGFibGVOYW1lLFxuICAgICAgfSxcbiAgICAgIHJvbGU6IGxhbWJkYVJvbGUsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIGZ1bmN0aW9uTmFtZTogQ29uc3RhbnRzLkJVTEtfQ1JFQVRFX0NPTlRBQ1RTX0xBTUJEQVxuICAgIH0pXG5cbiAgICAvLyBHcmFudCBwZXJtaXNzaW9ucyB0byBhY2Nlc3MgRHluYW1vREJcbiAgICB0ZW5UZW5Vc2VyVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGJ1bGtDcmVhdGVDb250YWN0TGFtYmRhKVxuXG4gICAgLy8gQ3JlYXRlIExhbWJkYSBmdW5jdGlvbiBmb3IgZ2V0dGluZyBjb250YWN0c1xuICAgIGNvbnN0IGdldENvbnRhY3RMYW1iZGEgPSBuZXcgbGFtYmRhTm9kZWpzLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdHZXRDb250YWN0RnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogJ3NyYy9sYW1iZGEvZ2V0LWNvbnRhY3RzLnRzJywgLy8gUGF0aCB0byB5b3VyIExhbWJkYSBjb2RlXG4gICAgICBoYW5kbGVyOiAncmV0cmlldmVDb250YWN0SGFuZGxlcicsIC8vIFRoZSBleHBvcnRlZCBmdW5jdGlvbiBuYW1lIGZvciBnZXR0aW5nIGNvbnRhY3RzXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHRlblRlblVzZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgICAgZnVuY3Rpb25OYW1lOiBDb25zdGFudHMuUkVUUklFVkVfQ09OVEFDVFNfTEFNQkRBXG4gICAgfSlcblxuICAgIC8vIEdyYW50IHBlcm1pc3Npb25zIHRvIGFjY2VzcyBEeW5hbW9EQlxuICAgIHRlblRlblVzZXJUYWJsZS5ncmFudFJlYWREYXRhKGdldENvbnRhY3RMYW1iZGEpXG5cbiAgICAvLyBDcmVhdGUgTGFtYmRhIGZ1bmN0aW9uIGZvciB1cGRhdGluZyBjb250YWN0c1xuICAgIGNvbnN0IHVwZGF0ZUNvbnRhY3RMYW1iZGEgPSBuZXcgbGFtYmRhTm9kZWpzLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdVcGRhdGVDb250YWN0RnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogJ3NyYy9sYW1iZGEvdXBkYXRlLWNvbnRhY3QudHMnLCAvLyBQYXRoIHRvIHlvdXIgTGFtYmRhIGNvZGVcbiAgICAgIGhhbmRsZXI6ICd1cGRhdGVDb250YWN0SGFuZGxlcicsIC8vIFRoZSBleHBvcnRlZCBmdW5jdGlvbiBuYW1lIGZvciB1cGRhdGluZyBjb250YWN0c1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiB0ZW5UZW5Vc2VyVGFibGUudGFibGVOYW1lLFxuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uTmFtZTogQ29uc3RhbnRzLlVQREFURV9DT05UQUNUU19MQU1CREFcbiAgICB9KVxuXG4gICAgLy8gR3JhbnQgcGVybWlzc2lvbnMgdG8gYWNjZXNzIER5bmFtb0RCXG4gICAgdGVuVGVuVXNlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YSh1cGRhdGVDb250YWN0TGFtYmRhKVxuXG4gICAgLy8gQ3JlYXRlIExhbWJkYSBmdW5jdGlvbiBmb3IgdXBkYXRpbmcgc3Vic2NyaXB0aW9uc1xuICAgIGNvbnN0IHVwZGF0ZUNvbnRhY3RTdWJzY3JpcHRpb25zTGFtYmRhID0gbmV3IGxhbWJkYU5vZGVqcy5Ob2RlanNGdW5jdGlvbih0aGlzLCAnVXBkYXRlQ29udGFjdFN1YnNjcmlwdGlvbnNGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiAnc3JjL2xhbWJkYS91cGRhdGUtY29udGFjdC1zdWJzY3JpcHRpb25zLnRzJywgLy8gUGF0aCB0byB5b3VyIExhbWJkYSBjb2RlXG4gICAgICBoYW5kbGVyOiAndXBkYXRlQ29udGFjdFN1YnNjcmlwdGlvbnNIYW5kbGVyJywgLy8gVGhlIGV4cG9ydGVkIGZ1bmN0aW9uIG5hbWUgZm9yIHVwZGF0aW5nIGNvbnRhY3RzXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHRlblRlblVzZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgICAgZnVuY3Rpb25OYW1lOiBDb25zdGFudHMuVVBEQVRFX0NPTlRBQ1RfU1VCU0NSSVBUSU9OX0xBTUJEQVxuICAgIH0pXG5cbiAgICAvLyBHcmFudCBwZXJtaXNzaW9ucyB0byBhY2Nlc3MgRHluYW1vREJcbiAgICB0ZW5UZW5Vc2VyVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHVwZGF0ZUNvbnRhY3RTdWJzY3JpcHRpb25zTGFtYmRhKVxuXG4gICAgLy8gQ3JlYXRlIExhbWJkYSBmdW5jdGlvbiBmb3IgdXBkYXRpbmcgc3Vic2NyaXB0aW9uc1xuICAgIGNvbnN0IFVuU3Vic2NyaWJlTGFtYmRhID0gbmV3IGxhbWJkYU5vZGVqcy5Ob2RlanNGdW5jdGlvbih0aGlzLCAnQ29udGFjdHNVbnN1YnNjcmliZUZ1bmN0aW9uJywge1xuICAgICAgZW50cnk6ICdzcmMvbGFtYmRhL3Vuc3Vic2NyaWJlLnRzJywgLy8gUGF0aCB0byB5b3VyIExhbWJkYSBjb2RlXG4gICAgICBoYW5kbGVyOiAndW5TdWJzY3JpYmVIYW5kbGVyJywgLy8gVGhlIGV4cG9ydGVkIGZ1bmN0aW9uIG5hbWUgZm9yIHVwZGF0aW5nIGNvbnRhY3RzXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHRlblRlblVzZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgICAgZnVuY3Rpb25OYW1lOiBcIlVuU3Vic2NyaWJlTGFtYmRhXCJcbiAgICB9KVxuXG4gICAgLy8gR3JhbnQgcGVybWlzc2lvbnMgdG8gYWNjZXNzIER5bmFtb0RCXG4gICAgdGVuVGVuVXNlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShVblN1YnNjcmliZUxhbWJkYSlcblxuICAgIC8vIENyZWF0ZSBhIExhbWJkYSBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgU05TIG1lc3NhZ2VzIChvcHRpb25hbClcbiAgICBjb25zdCBhZG1pbkFsZXJ0U25zSGFuZGxlckxhbWJkYSA9IG5ldyBsYW1iZGFOb2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgJ0FkbWluQWxlcnRTTlNIYW5kbGVyRnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogJ3NyYy9sYW1iZGEvYWRtaW4tYWxlcnQtc25zLWhhbmRsZXIudHMnLCAvLyBQYXRoIHRvIHlvdXIgTGFtYmRhIGNvZGVcbiAgICAgIGhhbmRsZXI6ICdhZG1pbkFsZXJ0U25zSGFuZGxlcicsIC8vIFRoZSBleHBvcnRlZCBmdW5jdGlvbiBuYW1lIGZvciBoYW5kbGluZyBTTlMgbWVzc2FnZXNcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnQWRtaW5BbGVydHNMYW1iZGEnLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQURNSU5fRU1BSUxTOiAnbWFsaG90cmEudmlrYXNAZ21haWwuY29tJ1xuICAgICAgfSxcblxuICAgIH0pXG5cbiAgICB0ZW5UZW5Vc2VyVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGFkbWluQWxlcnRTbnNIYW5kbGVyTGFtYmRhKVxuXG4gICAgLy8gU3Vic2NyaWJlIHRoZSBMYW1iZGEgdG8gdGhlIFNOUyBUb3BpYyAob3B0aW9uYWwpXG4gICAgc25zVG9waWNBZG1pbkFsZXJ0cy5hZGRTdWJzY3JpcHRpb24obmV3IHNuc1N1YnNjcmlwdGlvbnMuTGFtYmRhU3Vic2NyaXB0aW9uKGFkbWluQWxlcnRTbnNIYW5kbGVyTGFtYmRhKSlcblxuICAgIC8vIENyZWF0ZSBhIExhbWJkYSBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgU05TIG1lc3NhZ2VzIChvcHRpb25hbClcbiAgICBjb25zdCBjb250YWN0VmVyaWZpY2F0aW9uU25zSGFuZGxlckxhbWJkYSA9IG5ldyBsYW1iZGFOb2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgJ0NvbnRhY3RWZXJpZmljYXRpb25TTlNIYW5kbGVyRnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogJ3NyYy9sYW1iZGEvY29udGFjdC12ZXJpZmljYXRpb24tc25zLWhhbmRsZXIudHMnLCAvLyBQYXRoIHRvIHlvdXIgTGFtYmRhIGNvZGVcbiAgICAgIGhhbmRsZXI6ICdjb250YWN0VmVyaWZpY2F0aW9uU25zSGFuZGxlcicsIC8vIFRoZSBleHBvcnRlZCBmdW5jdGlvbiBuYW1lIGZvciBoYW5kbGluZyBTTlMgbWVzc2FnZXNcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnQ29udGFjdFZlcmlmaWNhdGlvbkxhbWJkYSdcbiAgICB9KVxuXG4gICAgdGVuVGVuVXNlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShjb250YWN0VmVyaWZpY2F0aW9uU25zSGFuZGxlckxhbWJkYSlcblxuICAgIC8vIFN1YnNjcmliZSB0aGUgTGFtYmRhIHRvIHRoZSBTTlMgVG9waWMgKG9wdGlvbmFsKVxuICAgIHNuc1RvcGljQ29udGFjdFZlcmlmaWNhdGlvbi5hZGRTdWJzY3JpcHRpb24obmV3IHNuc1N1YnNjcmlwdGlvbnMuTGFtYmRhU3Vic2NyaXB0aW9uKGNvbnRhY3RWZXJpZmljYXRpb25TbnNIYW5kbGVyTGFtYmRhKSlcblxuICAgIC8vIENyZWF0ZSBBUEkgR2F0ZXdheVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ1R1cnRsZUFJLWNvbnRhY3QtYXBpJywge1xuICAgICAgZGVwbG95T3B0aW9uczoge1xuICAgICAgICBzdGFnZU5hbWU6ICd2MScsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICBjb25zdCBjb250YWN0c1Jlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2NvbnRhY3RzJylcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnbGlzdHMnKVxuICAgIGNvbnN0IHVuc3Vic2NyaWJlUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgndW5zdWJzY3JpYmUnKVxuXG4gICAgLy8gQWRkIFBPU1QgbWV0aG9kIHRvIGNyZWF0ZSBjb250YWN0c1xuICAgIGNvbnN0IGNyZWF0ZUNvbnRhY3RJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGNyZWF0ZUNvbnRhY3RMYW1iZGEpXG4gICAgY29udGFjdHNSZXNvdXJjZS5hZGRNZXRob2QoJ1BPU1QnLCBjcmVhdGVDb250YWN0SW50ZWdyYXRpb24pXG5cbiAgICAvLyBBZGQgR0VUIG1ldGhvZCB0byByZXRyaWV2ZSBjb250YWN0c1xuICAgIGNvbnN0IGdldENvbnRhY3RJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldENvbnRhY3RMYW1iZGEpXG4gICAgY29udGFjdHNSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIGdldENvbnRhY3RJbnRlZ3JhdGlvbilcblxuICAgIC8vIEFkZCBQVVQgbWV0aG9kIHRvIHVwZGF0ZSBjb250YWN0c1xuICAgIGNvbnN0IHVwZGF0ZUNvbnRhY3RJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHVwZGF0ZUNvbnRhY3RMYW1iZGEpXG4gICAgY29udGFjdHNSZXNvdXJjZS5hZGRNZXRob2QoJ1BVVCcsIHVwZGF0ZUNvbnRhY3RJbnRlZ3JhdGlvbilcblxuICAgIC8vIEFkZCBQT1NUIGFuZCBERUxFVEUgbWV0aG9kIHRvIHVwZGF0ZSBjb250YWN0cyBzdWJzY3JpcHRpb25cbiAgICBjb25zdCB1cGRhdGVDb250YWN0U3Vic2NyaXB0aW9uc0ludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odXBkYXRlQ29udGFjdFN1YnNjcmlwdGlvbnNMYW1iZGEpXG4gICAgc3Vic2NyaXB0aW9uc1Jlc291cmNlLmFkZE1ldGhvZCgnUE9TVCcsIHVwZGF0ZUNvbnRhY3RTdWJzY3JpcHRpb25zSW50ZWdyYXRpb24pXG4gICAgc3Vic2NyaXB0aW9uc1Jlc291cmNlLmFkZE1ldGhvZCgnREVMRVRFJywgdXBkYXRlQ29udGFjdFN1YnNjcmlwdGlvbnNJbnRlZ3JhdGlvbilcblxuICAgIC8vIEFkZCBQT1NUIG1ldGhvZCB0byB1bnN1YnNjcmliZSBjb250YWN0c1xuICAgIGNvbnN0IGNvbnRhY3RVblN1YnNjcmlwdGlvbnNJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKFVuU3Vic2NyaWJlTGFtYmRhKVxuICAgIHVuc3Vic2NyaWJlUmVzb3VyY2UuYWRkTWV0aG9kKCdQT1NUJywgY29udGFjdFVuU3Vic2NyaXB0aW9uc0ludGVncmF0aW9uKVxuXG4gICAgLy8gR2l2ZSB0aGUgbGFtYmRhIGZ1bmN0aW9uIGFjY2VzcyB0byBBV1MgUGlucG9pbnRcbiAgICBjb25zdCBwaW5wb2ludEFjY2Vzc1BvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFsnbW9iaWxldGFyZ2V0aW5nOionXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSlcblxuICAgIGNyZWF0ZUNvbnRhY3RMYW1iZGEuYWRkVG9Sb2xlUG9saWN5KHBpbnBvaW50QWNjZXNzUG9saWN5KVxuICAgIGFkbWluQWxlcnRTbnNIYW5kbGVyTGFtYmRhLmFkZFRvUm9sZVBvbGljeShwaW5wb2ludEFjY2Vzc1BvbGljeSlcbiAgICB1cGRhdGVDb250YWN0TGFtYmRhLmFkZFRvUm9sZVBvbGljeShwaW5wb2ludEFjY2Vzc1BvbGljeSlcblxuICAgIC8vIElBTSBQb2xpY3kgdG8gc2VuZCBlbWFpbHMgdXNpbmcgU0VTXG4gICAgY29uc3Qgc2VzU2VuZEVtYWlsUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogWydzZXM6U2VuZEVtYWlsJywgJ3NlczpTZW5kUmF3RW1haWwnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSlcblxuICAgIC8vcGlucG9pbnRNZXNzYWdpbmdMYW1iZGEuYWRkVG9Sb2xlUG9saWN5KHNlc1NlbmRFbWFpbFBvbGljeSlcbiAgICBhZG1pbkFsZXJ0U25zSGFuZGxlckxhbWJkYS5hZGRUb1JvbGVQb2xpY3koc2VzU2VuZEVtYWlsUG9saWN5KVxuXG4gICAgY29uc3QgbWFya2V0aW5nU2VnbWVudERpbWVuc2lvbnM6IHBpbnBvaW50LkNmblNlZ21lbnQuU2VnbWVudERpbWVuc2lvbnNQcm9wZXJ0eSA9IHtcbiAgICAgIHVzZXJBdHRyaWJ1dGVzOiB7XG4gICAgICAgIGxpc3RzOiB7XG4gICAgICAgICAgVmFsdWVzOiBbJ21hcmtldGluZyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYXJrZXRpbmdTZWdtZW50ID0gbmV3IHBpbnBvaW50LkNmblNlZ21lbnQodGhpcywgJ01hcmtldGluZ1NlZ21lbnQnLCB7XG4gICAgICBhcHBsaWNhdGlvbklkOiBhcHBsaWNhdGlvbklkLFxuICAgICAgbmFtZTogXCJtYXJrZXRpbmdcIixcbiAgICAgIGRpbWVuc2lvbnM6IG1hcmtldGluZ1NlZ21lbnREaW1lbnNpb25zXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdtYXJrZXRpbmdTZWdtZW50JywgeyB2YWx1ZTogbWFya2V0aW5nU2VnbWVudC5hdHRyQXJuLnRvU3RyaW5nKCkgfSlcblxuICAgIGNvbnN0IGNsaW5pY2FsU2VnbWVudERpbWVuc2lvbnM6IHBpbnBvaW50LkNmblNlZ21lbnQuU2VnbWVudERpbWVuc2lvbnNQcm9wZXJ0eSA9IHtcbiAgICAgIHVzZXJBdHRyaWJ1dGVzOiB7XG4gICAgICAgIGxpc3RzOiB7XG4gICAgICAgICAgVmFsdWVzOiBbJ2NsaW5pY2FsJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNsaW5pY2FsU2VnbWVudCA9IG5ldyBwaW5wb2ludC5DZm5TZWdtZW50KHRoaXMsICdDbGluaWNhbFNlZ21lbnQnLCB7XG4gICAgICBhcHBsaWNhdGlvbklkOiBhcHBsaWNhdGlvbklkLFxuICAgICAgbmFtZTogXCJjbGluaWNhbFwiLFxuICAgICAgZGltZW5zaW9uczogY2xpbmljYWxTZWdtZW50RGltZW5zaW9uc1xuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnY2xpbmljYWxTZWdtZW50JywgeyB2YWx1ZTogY2xpbmljYWxTZWdtZW50LmF0dHJBcm4udG9TdHJpbmcoKSB9KVxuXG4gICAgLy8gT3V0cHV0IHRoZSBBUEkgZW5kcG9pbnQgVVJMXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0FwaUVuZHBvaW50Jywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgfSlcbiAgfVxufVxuIl19