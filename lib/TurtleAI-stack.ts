import { Construct } from 'constructs'

import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as Constants from '../src/utils/constants'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as pinpoint from 'aws-cdk-lib/aws-pinpoint'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions'

const applicationId = Constants.PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION

export class TurtleAIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const snsLoggingRole = new iam.Role(this, 'SnsLoggingRole', {
      assumedBy: new iam.ServicePrincipal('sns.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
    })

    // Define the SNS Publish Policy
    const snsPublishPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sns:Publish'],
      resources: ['*'], // It's better to specify the exact ARN of the SNS topic if possible
    })

    // Create SNS Topic for AdminAlerts
    const snsTopicAdminAlerts = new sns.Topic(this, 'TurtleAI-ContactSNSTopic-AdminAlerts', {
      displayName: 'TurtleAI-ContactSNSTopic-AdminAlerts',
      topicName: 'TurtleAI-ContactSNSTopic-AdminAlerts' // Explicit physical name
    })

    // Create SNS Topic for ContactVerification
    const snsTopicContactVerification = new sns.Topic(this, 'TurtleAI-ContactSNSTopic-ContactVerification', {
      displayName: 'TurtleAI-ContactSNSTopic-ContactVerification',
      topicName: 'TurtleAI-ContactSNSTopic-ContactVerification'
    })

    // Define DynamoDB table for contacts
    const tenTenUserTable = new dynamodb.Table(this, 'TenTenUsersTable', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      tableName: Constants.TEN_TEN_USERS_TABLE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
    })
        // Adding a Global Secondary Index (GSI) for 'managerId'
        tenTenUserTable.addGlobalSecondaryIndex({
          indexName: Constants.TEN_TEN_USERS_TABLE_NAME_IDX, // If you have a custom index for name
          partitionKey: { name: 'name', type: dynamodb.AttributeType.STRING },
          // You can include 'name' and 'email' as non-key attributes if you need to return these attributes in your query results
          projectionType: dynamodb.ProjectionType.INCLUDE,
          nonKeyAttributes: ['name', 'email']
        });
    

    // Define DynamoDB table for contacts
    const tenTenEmployeeTable = new dynamodb.Table(this, 'TenTenEmployeeTable', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      tableName: Constants.TEN_TEN_EMPLOYEES_TABLE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
    })
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
    })

    // Define DynamoDB table for Project Tasks
    const tenTenTasksTable = new dynamodb.Table(this, 'TenTenTasksTable', {
      partitionKey: { name: 'taskid', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      tableName: Constants.TEN_TEN_TASKS_TABLE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
    })
    // Adding a Global Secondary Index (GSI) for 'projectid'
    tenTenTasksTable.addGlobalSecondaryIndex({
      indexName: 'ProjectIdIndex',
      partitionKey: { name: 'projectid', type: dynamodb.AttributeType.STRING },
      // You can include 'name' and 'email' as non-key attributes if you need to return these attributes in your query results
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: ['name', 'taskid']
    });

    // Define DynamoDB table for contacts
    const tenTenJournalTable = new dynamodb.Table(this, 'TenTenJournalTable', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      tableName: Constants.TEN_TEN_JOURNAL_TABLE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use On-Demand billing mode
    })
        // Adding a Global Secondary Index (GSI) for 'managerId'
        tenTenJournalTable.addGlobalSecondaryIndex({
          indexName: Constants.TEN_TEN_JOURNAL_TABLE_TIMESTAMP_IDX, // If you have a custom index for name
          partitionKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
          // You can include 'name' and 'email' as non-key attributes if you need to return these attributes in your query results
          projectionType: dynamodb.ProjectionType.INCLUDE,
          nonKeyAttributes: ['email', 'timestamp', 'journaltype', 'entry', 'relatedemployee', 'relatedproject', 'relatedtask']
        });


    // Create IAM Role
    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: Constants.LAMBDA_ROLE,
      description: 'Role for Lambda with logging, DynamoDB and SNS permissions',
    })

    // Attach policies to the role

    // CloudWatch logs policy
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['arn:aws:logs:*:*:*'],
    }))

    // DynamoDB read/write policy
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem', 'dynamodb:Scan', 'dynamodb:Query'],
      resources: [Constants.TEN_TEN_EMPLOYEES_TABLE_ARN, Constants.TEN_TEN_JOURNAL_TABLE_ARN, Constants.TEN_TEN_PROJECTS_TABLE_ARN, Constants.TEN_TEN_TASKS_TABLE_ARN, Constants.TEN_TEN_USERS_TABLE_ARN], // Replace with your DynamoDB table ARN
    }))

    // SNS publish policy
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: ['*'], // Replace with your SNS topic ARN
    }))

    // S3 read/write policy
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:ListBucket'],
      resources: ['arn:aws:s3:::bulk-upload-contacts/*', 'arn:aws:s3:::bulk-upload-contacts']
    }))

    // Create Lambda function for creating contacts
    const createUserLambda = new lambdaNodejs.NodejsFunction(this, 'CreateUserFunction', {
      entry: 'src/lambda/create-users.ts', // Path to your Lambda code
      handler: 'createUserHandler', // The exported function name for creating contacts
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: tenTenUserTable.tableName,
      },
      role: lambdaRole,
      timeout: cdk.Duration.minutes(5),
      functionName: Constants.TEN_TEN_CREATE_USER_LAMBDA
    })

    createUserLambda.addToRolePolicy(snsPublishPolicy)

    // Grant permissions to access DynamoDB
    tenTenUserTable.grantReadWriteData(createUserLambda)

    // Allow Lambda to publish to the SNS Topic
    snsTopicAdminAlerts.grantPublish(createUserLambda)
    snsTopicContactVerification.grantPublish(createUserLambda)

    // Create Lambda function for creating contacts
    const fetchUserLambda = new lambdaNodejs.NodejsFunction(this, 'FetchUserFunction', {
      entry: 'src/lambda/get-users.ts', // Path to your Lambda code
      handler: 'retrieveUsersHandler', // The exported function name for creating contacts
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: tenTenUserTable.tableName,
      },
      role: lambdaRole,
      timeout: cdk.Duration.minutes(5),
      functionName: Constants.TEN_TEN_RETRIEVE_USER_LAMBDA
    })

    fetchUserLambda.addToRolePolicy(snsPublishPolicy)

    // Grant permissions to access DynamoDB
    tenTenUserTable.grantReadWriteData(fetchUserLambda)

    // Allow Lambda to publish to the SNS Topic
    snsTopicAdminAlerts.grantPublish(fetchUserLambda)
    snsTopicContactVerification.grantPublish(fetchUserLambda)


        // Create Lambda function for creating contacts
        const getJournalEntryLambda = new lambdaNodejs.NodejsFunction(this, 'GetJournalEntryFunction', {
          entry: 'src/lambda/get-journal-entry.ts', // Path to your Lambda code
          handler: 'getJournalEntryHandler', // The exported function name for creating contacts
          runtime: lambda.Runtime.NODEJS_18_X,
          environment: {
            TABLE_NAME: tenTenJournalTable.tableName,
          },
          role: lambdaRole,
          timeout: cdk.Duration.minutes(5),
          functionName: Constants.TEN_TEN_GET_JOURNAL_ENTRY_LAMBDA
        })
        
        // Grant permissions to access DynamoDB
        tenTenJournalTable.grantReadWriteData(getJournalEntryLambda)

        // Create Lambda function for creating contacts
        const createJournalEntryLambda = new lambdaNodejs.NodejsFunction(this, 'CreateJournalEntryFunction', {
          entry: 'src/lambda/create-journal-entry.ts', // Path to your Lambda code
          handler: 'createJournalEntryHandler', // The exported function name for creating contacts
          runtime: lambda.Runtime.NODEJS_18_X,
          environment: {
            TABLE_NAME: tenTenJournalTable.tableName,
          },
          role: lambdaRole,
          timeout: cdk.Duration.minutes(5),
          functionName: Constants.TEN_TEN_CREATE_JOURNAL_ENTRY_LAMBDA
        })
        
        // Grant permissions to access DynamoDB
        tenTenJournalTable.grantReadWriteData(createJournalEntryLambda)
    
    
    // Create Lambda function for uploading the CSV into the contacts
    const bulkCreateContactLambda = new lambdaNodejs.NodejsFunction(this, 'BulkCreateContactFunction', {
      entry: 'src/lambda/create-users.ts', // Path to your Lambda code
      handler: 'bulkCreateContactHandler', // The exported function name for creating contacts
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: tenTenUserTable.tableName,
      },
      role: lambdaRole,
      timeout: cdk.Duration.minutes(5),
      functionName: Constants.BULK_CREATE_CONTACTS_LAMBDA
    })

    // Grant permissions to access DynamoDB
    tenTenUserTable.grantReadWriteData(bulkCreateContactLambda)

    // Create Lambda function for getting contacts
    const getContactLambda = new lambdaNodejs.NodejsFunction(this, 'GetContactFunction', {
      entry: 'src/lambda/get-users.ts', // Path to your Lambda code
      handler: 'retrieveContactHandler', // The exported function name for getting contacts
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: tenTenUserTable.tableName,
      },
      functionName: Constants.RETRIEVE_CONTACTS_LAMBDA
    })

    // Grant permissions to access DynamoDB
    tenTenUserTable.grantReadData(getContactLambda)

    // Create Lambda function for updating contacts
    const updateContactLambda = new lambdaNodejs.NodejsFunction(this, 'UpdateContactFunction', {
      entry: 'src/lambda/update-users.ts', // Path to your Lambda code
      handler: 'updateContactHandler', // The exported function name for updating contacts
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: tenTenUserTable.tableName,
      },
      functionName: Constants.UPDATE_CONTACTS_LAMBDA
    })

    // Grant permissions to access DynamoDB
    tenTenUserTable.grantReadWriteData(updateContactLambda)

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'TurtleAI-Users-api', {
      deployOptions: {
        stageName: 'v1',
      },
    })

    const usersResource = api.root.addResource('users')
    const employeesResource = api.root.addResource('employees')
    const projectsResource = api.root.addResource('projects')
    const tasksResource = api.root.addResource('tasks')
    const journalResource = api.root.addResource('journals')

        // Add POST method to create Journal
        const createJournalEntryIntegration = new apigateway.LambdaIntegration(createJournalEntryLambda)
        journalResource.addMethod('POST', createJournalEntryIntegration)

        // Add GET method to create Journal
        const getJournalEntryIntegration = new apigateway.LambdaIntegration(getJournalEntryLambda)
        journalResource.addMethod('GET', getJournalEntryIntegration)
        
    // Add POST method to create contacts
    const createUserIntegration = new apigateway.LambdaIntegration(createUserLambda)
    usersResource.addMethod('POST', createUserIntegration)

    // Add GET method to retrieve contacts
    const getUserIntegration = new apigateway.LambdaIntegration(fetchUserLambda)
    usersResource.addMethod('GET', getUserIntegration)

    // Add PUT method to update contacts
    const updateContactIntegration = new apigateway.LambdaIntegration(updateContactLambda)
    usersResource.addMethod('PUT', updateContactIntegration)

    // Give the lambda function access to AWS Pinpoint
    const pinpointAccessPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['mobiletargeting:*'],
      resources: ['*'],
    })

    createUserLambda.addToRolePolicy(pinpointAccessPolicy)
    updateContactLambda.addToRolePolicy(pinpointAccessPolicy)

    // IAM Policy to send emails using SES
    const sesSendEmailPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    })

    const marketingSegmentDimensions: pinpoint.CfnSegment.SegmentDimensionsProperty = {
      userAttributes: {
        lists: {
          Values: ['marketing']
        }
      }
    }

    const marketingSegment = new pinpoint.CfnSegment(this, 'MarketingSegment', {
      applicationId: applicationId,
      name: "marketing",
      dimensions: marketingSegmentDimensions
    })

    new cdk.CfnOutput(this, 'marketingSegment', { value: marketingSegment.attrArn.toString() })

    const clinicalSegmentDimensions: pinpoint.CfnSegment.SegmentDimensionsProperty = {
      userAttributes: {
        lists: {
          Values: ['clinical']
        }
      }
    }

    const clinicalSegment = new pinpoint.CfnSegment(this, 'ClinicalSegment', {
      applicationId: applicationId,
      name: "clinical",
      dimensions: clinicalSegmentDimensions
    })

    new cdk.CfnOutput(this, 'clinicalSegment', { value: clinicalSegment.attrArn.toString() })

    // Output the API endpoint URL
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
    })
  }
}
