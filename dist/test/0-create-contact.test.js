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
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const Constants = __importStar(require("../src/utils/constants"));
const myHandler = require('../src/lambda/create-contact').createContactHandler;
const LambdaTester = require('lambda-tester');
const basicContactCreation_AllRequiredField_WebForm = {
    'email': 'django@gmail.com',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '14135551234',
    'tags': ['workout', 'tag2'],
    'message': 'Hi i would like to know more. Call me at XXXYTTYYY'
};
const basicContactCreation_AllRequiredField_WebForm_ExistingContact = {
    'email': 'andrew@gmail.com',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '14135551234',
    'tags': ['workout', 'tag2'],
    'message': 'Hi i would like to know more again. Call me at XXXYTTYYY'
};
const basicContactCreation_AllRequiredField = {
    'email': 'vikas@citypt.com',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '14135551234',
    'tags': ['workout', 'tag2']
};
const basicContactCreation_WellFormedAllFields = {
    'email': 'andrew@citypt.com',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '14135551234',
    'tags': ['workout', 'tag2'],
    'customFields': {
        'preferredLanguage': 'English',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2']
};
const basicContactCreation_OnlyRequiredFields = {
    'email': '33-Testjohndoe@gmail.com',
    'firstName': 'john'
};
const basicContactCreation_MissingEmail = {
    'firstName': 'john'
};
const basicContactCreation_InvalidEmailFormat = {
    'email': '33-Testjohndadsoe@gmailcom',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '14135551234',
    'tags': ['tag1', 'tag2'],
    'customFields': {
        'preferredLanguage': 'English',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2']
};
const basicContactCreation_InvalidPhoneFormat = {
    'email': '34-Testjohndadsoe@gmailcom',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '41sa33184527',
    'tags': ['tag1', 'tag2'],
    'customFields': {
        'preferredLanguage': 'English',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2']
};
const basicContactCreation_DuplicateEmail = {
    'email': 'DO-NOT-DELETE@citypt.com',
    'firstName': 'john',
    'lastName': 'doe',
    'phone': '14135551234',
    'tags': ['tag1', 'tag2'],
    'customFields': {
        'preferredLanguage': 'English',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2']
};
let lambdaEvent = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {
        accountId: 'your-account-id',
        resourceId: 'your-resource-id',
        stage: 'your-stage',
        requestId: 'your-request-id',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: 'your-account-id',
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '127.0.0.1',
            principalOrgId: null,
            accessKey: 'your-access-key',
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: 'your-user-arn',
            userAgent: 'user-agent',
            user: 'your-user',
            apiKey: null,
            apiKeyId: null,
            clientCert: null
        },
        apiId: 'your-api-id',
        authorizer: null,
        protocol: 'HTTP/1.1',
        httpMethod: 'POST',
        path: '/your-resource-path',
        requestTimeEpoch: 1679251198000,
        resourcePath: '/{proxy+}'
    },
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    stageVariables: null,
    resource: 'your-resource'
};
let lambdaEventWebform = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        formType: 'web-lead'
    },
    requestContext: {
        accountId: 'your-account-id',
        resourceId: 'your-resource-id',
        stage: 'your-stage',
        requestId: 'your-request-id',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: 'your-account-id',
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '127.0.0.1',
            principalOrgId: null,
            accessKey: 'your-access-key',
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: 'your-user-arn',
            userAgent: 'user-agent',
            user: 'your-user',
            apiKey: null,
            apiKeyId: null,
            clientCert: null
        },
        apiId: 'your-api-id',
        authorizer: null,
        protocol: 'HTTP/1.1',
        httpMethod: 'POST',
        path: '/your-resource-path',
        requestTimeEpoch: 1679251198000,
        resourcePath: '/{proxy+}'
    },
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    stageVariables: null,
    resource: 'your-resource'
};
let lambdaEventWebformBadParam = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        formType: 'weblead'
    },
    requestContext: {
        accountId: 'your-account-id',
        resourceId: 'your-resource-id',
        stage: 'your-stage',
        requestId: 'your-request-id',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: 'your-account-id',
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '127.0.0.1',
            principalOrgId: null,
            accessKey: 'your-access-key',
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: 'your-user-arn',
            userAgent: 'user-agent',
            user: 'your-user',
            apiKey: null,
            apiKeyId: null,
            clientCert: null
        },
        apiId: 'your-api-id',
        authorizer: null,
        protocol: 'HTTP/1.1',
        httpMethod: 'POST',
        path: '/your-resource-path',
        requestTimeEpoch: 1679251198000,
        resourcePath: '/{proxy+}'
    },
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    stageVariables: null,
    resource: 'your-resource'
};
describe('DynamoDB Put Action in Lambda', () => {
    // Initialize AWS SDK
    beforeAll(async () => {
        AWSMock.setSDKInstance(AWS);
        await deleteTestData();
    });
    // Cleanup after tests
    afterAll(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });
    it('Should fail with Validation error while putting an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField_WebForm_NoEmail', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_AllRequiredField_WebForm with bad Event Query Param");
        lambdaEventWebformBadParam.body = JSON.stringify(basicContactCreation_AllRequiredField_WebForm);
        return LambdaTester(myHandler)
            .event(lambdaEventWebformBadParam)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField_WebForm', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_AllRequiredField_WebForm");
        lambdaEventWebform.body = JSON.stringify(basicContactCreation_AllRequiredField_WebForm);
        return LambdaTester(myHandler)
            .event(lambdaEventWebform)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField_WebForm_ExistingContact', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_AllRequiredField_WebForm_ExistingContact");
        lambdaEventWebform.body = JSON.stringify(basicContactCreation_AllRequiredField_WebForm_ExistingContact);
        return LambdaTester(myHandler)
            .event(lambdaEventWebform)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_AllRequiredField");
        lambdaEvent.body = JSON.stringify(basicContactCreation_AllRequiredField);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_WellFormedAllFields', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_WellFormedAllFields");
        lambdaEvent.body = JSON.stringify(basicContactCreation_WellFormedAllFields);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_OnlyRequiredFields', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_OnlyRequiredFields");
        lambdaEvent.body = JSON.stringify(basicContactCreation_OnlyRequiredFields);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_MissingEmail', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_MissingEmail");
        lambdaEvent.body = JSON.stringify(basicContactCreation_MissingEmail);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.ERROR);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_InvalidEmailFormat', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_InvalidEmailFormat");
        lambdaEvent.body = JSON.stringify(basicContactCreation_InvalidEmailFormat);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.ERROR);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_InvalidPhoneFormat', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_InvalidPhoneFormat");
        lambdaEvent.body = JSON.stringify(basicContactCreation_InvalidPhoneFormat);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.ERROR);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should put an item to DynamoDB within Lambda - basicContactCreation_DuplicateEmail', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_DuplicateEmail");
        lambdaEvent.body = JSON.stringify(basicContactCreation_DuplicateEmail);
        return LambdaTester(myHandler)
            .event(lambdaEvent)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.ERROR);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
});
async function deleteTestData() {
    const testRecords = [
        { email: 'django@gmail.com' },
        { email: 'andrew@citypt.com' },
        { email: 'vikas@citypt.com' },
        { email: '33-Testjohndoe@gmail.com' }
        // Add other test records as needed
    ];
    testRecords.forEach(record => {
        const params = {
            TableName: Constants.CONTACTS_TABLE,
            Key: {
                "email": Constants.CONTACTS_TABLE_SORT_KEY
            },
            Region: Constants.AWS_REGION
        };
        dynamoDB.delete(params, (err, data) => {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC1jcmVhdGUtY29udGFjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC8wLWNyZWF0ZS1jb250YWN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN2QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBRWxELGtFQUFtRDtBQUVuRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQTtBQUU5RSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7QUFHN0MsTUFBTSw2Q0FBNkMsR0FBRztJQUNwRCxPQUFPLEVBQUUsa0JBQWtCO0lBQzNCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLE1BQU0sRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7SUFDM0IsU0FBUyxFQUFFLG9EQUFvRDtDQUNoRSxDQUFBO0FBRUQsTUFBTSw2REFBNkQsR0FBRztJQUNwRSxPQUFPLEVBQUUsa0JBQWtCO0lBQzNCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLE1BQU0sRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7SUFDM0IsU0FBUyxFQUFFLDBEQUEwRDtDQUN0RSxDQUFBO0FBRUQsTUFBTSxxQ0FBcUMsR0FBRztJQUM1QyxPQUFPLEVBQUUsa0JBQWtCO0lBQzNCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLE9BQU8sRUFB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QUFFRixLQUFLLFVBQVUsY0FBYztJQUMzQixNQUFNLFdBQVcsR0FBRztRQUNsQixFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtRQUM3QixFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtRQUM5QixFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtRQUM3QixFQUFFLEtBQUssRUFBRSwwQkFBMEIsRUFBRTtRQUNyQyxtQ0FBbUM7S0FDcEMsQ0FBQTtJQUVELFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDM0IsTUFBTSxNQUFNLEdBQUc7WUFDYixTQUFTLEVBQUUsU0FBUyxDQUFDLGNBQWM7WUFDbkMsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFBRSxTQUFTLENBQUMsdUJBQXVCO2FBQzNDO1lBQ0QsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVO1NBQzdCLENBQUE7UUFFRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUM5QyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2xGO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDcEU7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUosQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFXU01vY2sgPSByZXF1aXJlKCdhd3Mtc2RrLW1vY2snKVxuY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5jb25zdCBkeW5hbW9EQiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKVxuXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vc3JjL3V0aWxzL2NvbnN0YW50cydcblxuY29uc3QgbXlIYW5kbGVyID0gcmVxdWlyZSgnLi4vc3JjL2xhbWJkYS9jcmVhdGUtY29udGFjdCcpLmNyZWF0ZUNvbnRhY3RIYW5kbGVyXG5cbmNvbnN0IExhbWJkYVRlc3RlciA9IHJlcXVpcmUoJ2xhbWJkYS10ZXN0ZXInKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSBcImF3cy1sYW1iZGFcIlxuXG5jb25zdCBiYXNpY0NvbnRhY3RDcmVhdGlvbl9BbGxSZXF1aXJlZEZpZWxkX1dlYkZvcm0gPSB7XG4gICdlbWFpbCc6ICdkamFuZ29AZ21haWwuY29tJyxcbiAgJ2ZpcnN0TmFtZSc6ICdqb2huJyxcbiAgJ2xhc3ROYW1lJzogJ2RvZScsXG4gICdwaG9uZSc6ICcxNDEzNTU1MTIzNCcsXG4gICd0YWdzJzogWyd3b3Jrb3V0JywgJ3RhZzInXSxcbiAgJ21lc3NhZ2UnOiAnSGkgaSB3b3VsZCBsaWtlIHRvIGtub3cgbW9yZS4gQ2FsbCBtZSBhdCBYWFhZVFRZWVknXG59XG5cbmNvbnN0IGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybV9FeGlzdGluZ0NvbnRhY3QgPSB7XG4gICdlbWFpbCc6ICdhbmRyZXdAZ21haWwuY29tJyxcbiAgJ2ZpcnN0TmFtZSc6ICdqb2huJyxcbiAgJ2xhc3ROYW1lJzogJ2RvZScsXG4gICdwaG9uZSc6ICcxNDEzNTU1MTIzNCcsXG4gICd0YWdzJzogWyd3b3Jrb3V0JywgJ3RhZzInXSxcbiAgJ21lc3NhZ2UnOiAnSGkgaSB3b3VsZCBsaWtlIHRvIGtub3cgbW9yZSBhZ2Fpbi4gQ2FsbCBtZSBhdCBYWFhZVFRZWVknXG59XG5cbmNvbnN0IGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGQgPSB7XG4gICdlbWFpbCc6ICd2aWthc0BjaXR5cHQuY29tJyxcbiAgJ2ZpcnN0TmFtZSc6ICdqb2huJyxcbiAgJ2xhc3ROYW1lJzogJ2RvZScsXG4gICdwaG9uZSc6ICcxNDEzNTU1MTIzNCcsXG4gICd0YWdzJzogWyd3b3Jrb3V0JywgJ3RhZzInXVxufVxuXG5jb25zdCBiYXNpY0NvbnRhY3RDcmVhdGlvbl9XZWxsRm9ybWVkQWxsRmllbGRzID0ge1xuICAnZW1haWwnOiAnYW5kcmV3QGNpdHlwdC5jb20nLFxuICAnZmlyc3ROYW1lJzogJ2pvaG4nLFxuICAnbGFzdE5hbWUnOiAnZG9lJyxcbiAgJ3Bob25lJzogJzE0MTM1NTUxMjM0JyxcbiAgJ3RhZ3MnOiBbJ3dvcmtvdXQnLCAndGFnMiddLFxuICAnY3VzdG9tRmllbGRzJzoge1xuICAgICdwcmVmZXJyZWRMYW5ndWFnZSc6ICdFbmdsaXNoJyxcbiAgICAnZGF0ZU9mQmlydGgnOiAnMjAwMC0wMS0wMScsXG4gICAgJ25pY2tOYW1lJzogJ1ZpaydcbiAgfSxcbiAgJ2xpc3RzJzogWydsaXN0MScsICdsaXN0MiddXG59XG5cbmNvbnN0IGJhc2ljQ29udGFjdENyZWF0aW9uX09ubHlSZXF1aXJlZEZpZWxkcyA9IHtcbiAgJ2VtYWlsJzogJzMzLVRlc3Rqb2huZG9lQGdtYWlsLmNvbScsXG4gICdmaXJzdE5hbWUnOiAnam9obidcbn1cblxuY29uc3QgYmFzaWNDb250YWN0Q3JlYXRpb25fTWlzc2luZ0VtYWlsID0ge1xuICAnZmlyc3ROYW1lJzogJ2pvaG4nXG59XG5cbmNvbnN0IGJhc2ljQ29udGFjdENyZWF0aW9uX0ludmFsaWRFbWFpbEZvcm1hdCA9IHtcbiAgJ2VtYWlsJzogJzMzLVRlc3Rqb2huZGFkc29lQGdtYWlsY29tJyxcbiAgJ2ZpcnN0TmFtZSc6ICdqb2huJyxcbiAgJ2xhc3ROYW1lJzogJ2RvZScsXG4gICdwaG9uZSc6ICcxNDEzNTU1MTIzNCcsXG4gICd0YWdzJzogWyd0YWcxJywgJ3RhZzInXSxcbiAgJ2N1c3RvbUZpZWxkcyc6IHtcbiAgICAncHJlZmVycmVkTGFuZ3VhZ2UnOiAnRW5nbGlzaCcsXG4gICAgJ2RhdGVPZkJpcnRoJzogJzIwMDAtMDEtMDEnLFxuICAgICduaWNrTmFtZSc6ICdWaWsnXG4gIH0sXG4gICdsaXN0cyc6IFsnbGlzdDEnLCAnbGlzdDInXVxufVxuXG5jb25zdCBiYXNpY0NvbnRhY3RDcmVhdGlvbl9JbnZhbGlkUGhvbmVGb3JtYXQgPSB7XG4gICdlbWFpbCc6ICczNC1UZXN0am9obmRhZHNvZUBnbWFpbGNvbScsXG4gICdmaXJzdE5hbWUnOiAnam9obicsXG4gICdsYXN0TmFtZSc6ICdkb2UnLFxuICAncGhvbmUnOiAnNDFzYTMzMTg0NTI3JyxcbiAgJ3RhZ3MnOiBbJ3RhZzEnLCAndGFnMiddLFxuICAnY3VzdG9tRmllbGRzJzoge1xuICAgICdwcmVmZXJyZWRMYW5ndWFnZSc6ICdFbmdsaXNoJyxcbiAgICAnZGF0ZU9mQmlydGgnOiAnMjAwMC0wMS0wMScsXG4gICAgJ25pY2tOYW1lJzogJ1ZpaydcbiAgfSxcbiAgJ2xpc3RzJzogWydsaXN0MScsICdsaXN0MiddXG59XG5cbmNvbnN0IGJhc2ljQ29udGFjdENyZWF0aW9uX0R1cGxpY2F0ZUVtYWlsID0ge1xuICAnZW1haWwnOiAnRE8tTk9ULURFTEVURUBjaXR5cHQuY29tJyxcbiAgJ2ZpcnN0TmFtZSc6ICdqb2huJyxcbiAgJ2xhc3ROYW1lJzogJ2RvZScsXG4gICdwaG9uZSc6ICcxNDEzNTU1MTIzNCcsXG4gICd0YWdzJzogWyd0YWcxJywgJ3RhZzInXSxcbiAgJ2N1c3RvbUZpZWxkcyc6IHtcbiAgICAncHJlZmVycmVkTGFuZ3VhZ2UnOiAnRW5nbGlzaCcsXG4gICAgJ2RhdGVPZkJpcnRoJzogJzIwMDAtMDEtMDEnLFxuICAgICduaWNrTmFtZSc6ICdWaWsnXG4gIH0sXG4gICdsaXN0cyc6IFsnbGlzdDEnLCAnbGlzdDInXVxufVxuXG5sZXQgbGFtYmRhRXZlbnQgPSB7XG4gIGJvZHk6ICcnLFxuICBoZWFkZXJzOiB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9LFxuICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgcGF0aFBhcmFtZXRlcnM6IG51bGwsXG4gIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczogbnVsbCxcbiAgcmVxdWVzdENvbnRleHQ6IHtcbiAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgIHJlc291cmNlSWQ6ICd5b3VyLXJlc291cmNlLWlkJyxcbiAgICBzdGFnZTogJ3lvdXItc3RhZ2UnLFxuICAgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG4gICAgaWRlbnRpdHk6IHtcbiAgICAgIGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcbiAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICBjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcbiAgICAgIGNhbGxlcjogbnVsbCxcbiAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcbiAgICAgIHByaW5jaXBhbE9yZ0lkOiBudWxsLFxuICAgICAgYWNjZXNzS2V5OiAneW91ci1hY2Nlc3Mta2V5JyxcbiAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG4gICAgICBjb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcjogbnVsbCxcbiAgICAgIHVzZXJBcm46ICd5b3VyLXVzZXItYXJuJyxcbiAgICAgIHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuICAgICAgdXNlcjogJ3lvdXItdXNlcicsXG4gICAgICBhcGlLZXk6IG51bGwsXG4gICAgICBhcGlLZXlJZDogbnVsbCxcbiAgICAgIGNsaWVudENlcnQ6IG51bGxcbiAgICB9LFxuICAgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuICAgIGF1dGhvcml6ZXI6IG51bGwsXG4gICAgcHJvdG9jb2w6ICdIVFRQLzEuMScsXG4gICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgICByZXF1ZXN0VGltZUVwb2NoOiAxNjc5MjUxMTk4MDAwLFxuICAgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcbiAgfSxcbiAgbXVsdGlWYWx1ZUhlYWRlcnM6IHt9LFxuICBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcbiAgc3RhZ2VWYXJpYWJsZXM6IG51bGwsXG4gIHJlc291cmNlOiAneW91ci1yZXNvdXJjZSdcbn1cblxubGV0IGxhbWJkYUV2ZW50V2ViZm9ybSA9IHtcbiAgYm9keTogJycsXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH0sXG4gIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICBwYXRoUGFyYW1ldGVyczogbnVsbCxcbiAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7XG4gICAgZm9ybVR5cGU6ICd3ZWItbGVhZCdcbiAgfSxcbiAgcmVxdWVzdENvbnRleHQ6IHtcbiAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgIHJlc291cmNlSWQ6ICd5b3VyLXJlc291cmNlLWlkJyxcbiAgICBzdGFnZTogJ3lvdXItc3RhZ2UnLFxuICAgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG4gICAgaWRlbnRpdHk6IHtcbiAgICAgIGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcbiAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICBjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcbiAgICAgIGNhbGxlcjogbnVsbCxcbiAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcbiAgICAgIHByaW5jaXBhbE9yZ0lkOiBudWxsLFxuICAgICAgYWNjZXNzS2V5OiAneW91ci1hY2Nlc3Mta2V5JyxcbiAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG4gICAgICBjb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcjogbnVsbCxcbiAgICAgIHVzZXJBcm46ICd5b3VyLXVzZXItYXJuJyxcbiAgICAgIHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuICAgICAgdXNlcjogJ3lvdXItdXNlcicsXG4gICAgICBhcGlLZXk6IG51bGwsXG4gICAgICBhcGlLZXlJZDogbnVsbCxcbiAgICAgIGNsaWVudENlcnQ6IG51bGxcbiAgICB9LFxuICAgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuICAgIGF1dGhvcml6ZXI6IG51bGwsXG4gICAgcHJvdG9jb2w6ICdIVFRQLzEuMScsXG4gICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgICByZXF1ZXN0VGltZUVwb2NoOiAxNjc5MjUxMTk4MDAwLFxuICAgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcbiAgfSxcbiAgbXVsdGlWYWx1ZUhlYWRlcnM6IHt9LFxuICBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcbiAgc3RhZ2VWYXJpYWJsZXM6IG51bGwsXG4gIHJlc291cmNlOiAneW91ci1yZXNvdXJjZSdcbn1cblxubGV0IGxhbWJkYUV2ZW50V2ViZm9ybUJhZFBhcmFtID0ge1xuICBib2R5OiAnJyxcbiAgaGVhZGVyczoge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgfSxcbiAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gIHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcbiAgICBmb3JtVHlwZTogJ3dlYmxlYWQnXG4gIH0sXG4gIHJlcXVlc3RDb250ZXh0OiB7XG4gICAgYWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcbiAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgc3RhZ2U6ICd5b3VyLXN0YWdlJyxcbiAgICByZXF1ZXN0SWQ6ICd5b3VyLXJlcXVlc3QtaWQnLFxuICAgIGlkZW50aXR5OiB7XG4gICAgICBjb2duaXRvSWRlbnRpdHlQb29sSWQ6IG51bGwsXG4gICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICBjYWxsZXI6IG51bGwsXG4gICAgICBzb3VyY2VJcDogJzEyNy4wLjAuMScsXG4gICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgIGFjY2Vzc0tleTogJ3lvdXItYWNjZXNzLWtleScsXG4gICAgICBjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICB1c2VyQXJuOiAneW91ci11c2VyLWFybicsXG4gICAgICB1c2VyQWdlbnQ6ICd1c2VyLWFnZW50JyxcbiAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgYXBpS2V5OiBudWxsLFxuICAgICAgYXBpS2V5SWQ6IG51bGwsXG4gICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgfSxcbiAgICBhcGlJZDogJ3lvdXItYXBpLWlkJyxcbiAgICBhdXRob3JpemVyOiBudWxsLFxuICAgIHByb3RvY29sOiAnSFRUUC8xLjEnLFxuICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgcmVxdWVzdFRpbWVFcG9jaDogMTY3OTI1MTE5ODAwMCxcbiAgICByZXNvdXJjZVBhdGg6ICcve3Byb3h5K30nXG4gIH0sXG4gIG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcbiAgbXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge30sXG4gIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICByZXNvdXJjZTogJ3lvdXItcmVzb3VyY2UnXG59XG5cbmRlc2NyaWJlKCdEeW5hbW9EQiBQdXQgQWN0aW9uIGluIExhbWJkYScsICgpID0+IHtcbiAgLy8gSW5pdGlhbGl6ZSBBV1MgU0RLXG4gIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgQVdTTW9jay5zZXRTREtJbnN0YW5jZShBV1MpXG4gICAgYXdhaXQgZGVsZXRlVGVzdERhdGEoKVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgdGVzdHNcbiAgYWZ0ZXJBbGwoKCkgPT4ge1xuICAgIEFXU01vY2sucmVzdG9yZSgnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnKVxuICB9KVxuXG4gIGl0KCdTaG91bGQgZmFpbCB3aXRoIFZhbGlkYXRpb24gZXJyb3Igd2hpbGUgcHV0dGluZyBhbiBpdGVtIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEgLSBiYXNpY0NvbnRhY3RDcmVhdGlvbl9BbGxSZXF1aXJlZEZpZWxkX1dlYkZvcm1fTm9FbWFpbCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtb2NrUHV0SXRlbSA9IGplc3QuZm4oKVxuICAgIEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAncHV0JywgbW9ja1B1dEl0ZW0pXG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybSB3aXRoIGJhZCBFdmVudCBRdWVyeSBQYXJhbVwiKVxuXG4gICAgbGFtYmRhRXZlbnRXZWJmb3JtQmFkUGFyYW0uYm9keSA9IEpTT04uc3RyaW5naWZ5KGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybSlcblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50V2ViZm9ybUJhZFBhcmFtKVxuICAgICAgLmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG4gICAgICAgIC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgLy9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLlNVQ0NFU1MpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCBwdXQgYW4gaXRlbSB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhIC0gYmFzaWNDb250YWN0Q3JlYXRpb25fQWxsUmVxdWlyZWRGaWVsZF9XZWJGb3JtJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tQdXRJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrUHV0SXRlbSlcblxuICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBiYXNpY0NvbnRhY3RDcmVhdGlvbl9BbGxSZXF1aXJlZEZpZWxkX1dlYkZvcm1cIilcbiAgICBsYW1iZGFFdmVudFdlYmZvcm0uYm9keSA9IEpTT04uc3RyaW5naWZ5KGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybSlcblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50V2ViZm9ybSlcbiAgICAgIC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuICAgICAgICAvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5TVUNDRVNTKVxuICAgICAgfSlcblxuICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuICB9KVxuXG4gIGl0KCdTaG91bGQgcHV0IGFuIGl0ZW0gdG8gRHluYW1vREIgd2l0aGluIExhbWJkYSAtIGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybV9FeGlzdGluZ0NvbnRhY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1B1dEl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tQdXRJdGVtKVxuXG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybV9FeGlzdGluZ0NvbnRhY3RcIilcbiAgICBsYW1iZGFFdmVudFdlYmZvcm0uYm9keSA9IEpTT04uc3RyaW5naWZ5KGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGRfV2ViRm9ybV9FeGlzdGluZ0NvbnRhY3QpXG5cbiAgICByZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcbiAgICAgIC5ldmVudChsYW1iZGFFdmVudFdlYmZvcm0pXG4gICAgICAuZXhwZWN0UmVzb2x2ZSgocmVzdWx0OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHtcbiAgICAgICAgLy9leHBlY3QoYWRkRW5kcG9pbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICAvL2V4cGVjdChjaGVja0lmRW1haWxBbHJlYWR5RXhpc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZShDb25zdGFudHMuU1VDQ0VTUylcbiAgICAgIH0pXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcblxuICBpdCgnU2hvdWxkIHB1dCBhbiBpdGVtIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEgLSBiYXNpY0NvbnRhY3RDcmVhdGlvbl9BbGxSZXF1aXJlZEZpZWxkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tQdXRJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrUHV0SXRlbSlcblxuICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBiYXNpY0NvbnRhY3RDcmVhdGlvbl9BbGxSZXF1aXJlZEZpZWxkXCIpXG4gICAgbGFtYmRhRXZlbnQuYm9keSA9IEpTT04uc3RyaW5naWZ5KGJhc2ljQ29udGFjdENyZWF0aW9uX0FsbFJlcXVpcmVkRmllbGQpXG5cbiAgICByZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcbiAgICAgIC5ldmVudChsYW1iZGFFdmVudClcbiAgICAgIC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuICAgICAgICAvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5TVUNDRVNTKVxuICAgICAgfSlcblxuICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuICB9KVxuXG4gIGl0KCdTaG91bGQgcHV0IGFuIGl0ZW0gdG8gRHluYW1vREIgd2l0aGluIExhbWJkYSAtIGJhc2ljQ29udGFjdENyZWF0aW9uX1dlbGxGb3JtZWRBbGxGaWVsZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1B1dEl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tQdXRJdGVtKVxuXG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGJhc2ljQ29udGFjdENyZWF0aW9uX1dlbGxGb3JtZWRBbGxGaWVsZHNcIilcbiAgICBsYW1iZGFFdmVudC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYmFzaWNDb250YWN0Q3JlYXRpb25fV2VsbEZvcm1lZEFsbEZpZWxkcylcblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50KVxuICAgICAgLmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG4gICAgICAgIC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgLy9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLlNVQ0NFU1MpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCBwdXQgYW4gaXRlbSB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhIC0gYmFzaWNDb250YWN0Q3JlYXRpb25fT25seVJlcXVpcmVkRmllbGRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tQdXRJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrUHV0SXRlbSlcblxuICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBiYXNpY0NvbnRhY3RDcmVhdGlvbl9Pbmx5UmVxdWlyZWRGaWVsZHNcIilcbiAgICBsYW1iZGFFdmVudC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYmFzaWNDb250YWN0Q3JlYXRpb25fT25seVJlcXVpcmVkRmllbGRzKVxuXG4gICAgcmV0dXJuIExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG4gICAgICAuZXZlbnQobGFtYmRhRXZlbnQpXG4gICAgICAuZXhwZWN0UmVzb2x2ZSgocmVzdWx0OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHtcbiAgICAgICAgLy9leHBlY3QoYWRkRW5kcG9pbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICAvL2V4cGVjdChjaGVja0lmRW1haWxBbHJlYWR5RXhpc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZShDb25zdGFudHMuU1VDQ0VTUylcbiAgICAgIH0pXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcblxuICBpdCgnU2hvdWxkIHB1dCBhbiBpdGVtIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEgLSBiYXNpY0NvbnRhY3RDcmVhdGlvbl9NaXNzaW5nRW1haWwnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1B1dEl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tQdXRJdGVtKVxuXG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGJhc2ljQ29udGFjdENyZWF0aW9uX01pc3NpbmdFbWFpbFwiKVxuICAgIGxhbWJkYUV2ZW50LmJvZHkgPSBKU09OLnN0cmluZ2lmeShiYXNpY0NvbnRhY3RDcmVhdGlvbl9NaXNzaW5nRW1haWwpXG5cbiAgICByZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcbiAgICAgIC5ldmVudChsYW1iZGFFdmVudClcbiAgICAgIC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuICAgICAgICAvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5FUlJPUilcbiAgICAgIH0pXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcblxuICBpdCgnU2hvdWxkIHB1dCBhbiBpdGVtIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEgLSBiYXNpY0NvbnRhY3RDcmVhdGlvbl9JbnZhbGlkRW1haWxGb3JtYXQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1B1dEl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tQdXRJdGVtKVxuXG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGJhc2ljQ29udGFjdENyZWF0aW9uX0ludmFsaWRFbWFpbEZvcm1hdFwiKVxuICAgIGxhbWJkYUV2ZW50LmJvZHkgPSBKU09OLnN0cmluZ2lmeShiYXNpY0NvbnRhY3RDcmVhdGlvbl9JbnZhbGlkRW1haWxGb3JtYXQpXG5cbiAgICByZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcbiAgICAgIC5ldmVudChsYW1iZGFFdmVudClcbiAgICAgIC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuICAgICAgICAvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5FUlJPUilcbiAgICAgIH0pXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcblxuICBpdCgnU2hvdWxkIHB1dCBhbiBpdGVtIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEgLSBiYXNpY0NvbnRhY3RDcmVhdGlvbl9JbnZhbGlkUGhvbmVGb3JtYXQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1B1dEl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tQdXRJdGVtKVxuICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBiYXNpY0NvbnRhY3RDcmVhdGlvbl9JbnZhbGlkUGhvbmVGb3JtYXRcIilcbiAgICBsYW1iZGFFdmVudC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYmFzaWNDb250YWN0Q3JlYXRpb25fSW52YWxpZFBob25lRm9ybWF0KVxuXG4gICAgcmV0dXJuIExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG4gICAgICAuZXZlbnQobGFtYmRhRXZlbnQpXG4gICAgICAuZXhwZWN0UmVzb2x2ZSgocmVzdWx0OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHtcbiAgICAgICAgLy9leHBlY3QoYWRkRW5kcG9pbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICAvL2V4cGVjdChjaGVja0lmRW1haWxBbHJlYWR5RXhpc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZShDb25zdGFudHMuRVJST1IpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCBwdXQgYW4gaXRlbSB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhIC0gYmFzaWNDb250YWN0Q3JlYXRpb25fRHVwbGljYXRlRW1haWwnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1B1dEl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tQdXRJdGVtKVxuXG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGJhc2ljQ29udGFjdENyZWF0aW9uX0R1cGxpY2F0ZUVtYWlsXCIpXG4gICAgbGFtYmRhRXZlbnQuYm9keSA9IEpTT04uc3RyaW5naWZ5KGJhc2ljQ29udGFjdENyZWF0aW9uX0R1cGxpY2F0ZUVtYWlsKVxuXG4gICAgcmV0dXJuIExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG4gICAgICAuZXZlbnQobGFtYmRhRXZlbnQpXG4gICAgICAuZXhwZWN0UmVzb2x2ZSgocmVzdWx0OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHtcbiAgICAgICAgLy9leHBlY3QoYWRkRW5kcG9pbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICAvL2V4cGVjdChjaGVja0lmRW1haWxBbHJlYWR5RXhpc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZShDb25zdGFudHMuRVJST1IpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG59KVxuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVUZXN0RGF0YSgpIHtcbiAgY29uc3QgdGVzdFJlY29yZHMgPSBbXG4gICAgeyBlbWFpbDogJ2RqYW5nb0BnbWFpbC5jb20nIH0sXG4gICAgeyBlbWFpbDogJ2FuZHJld0BjaXR5cHQuY29tJyB9LFxuICAgIHsgZW1haWw6ICd2aWthc0BjaXR5cHQuY29tJyB9LFxuICAgIHsgZW1haWw6ICczMy1UZXN0am9obmRvZUBnbWFpbC5jb20nIH1cbiAgICAvLyBBZGQgb3RoZXIgdGVzdCByZWNvcmRzIGFzIG5lZWRlZFxuICBdXG5cbiAgdGVzdFJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIFRhYmxlTmFtZTogQ29uc3RhbnRzLkNPTlRBQ1RTX1RBQkxFLFxuICAgICAgS2V5OiB7XG4gICAgICAgIFwiZW1haWxcIjogQ29uc3RhbnRzLkNPTlRBQ1RTX1RBQkxFX1NPUlRfS0VZXG4gICAgICB9LFxuICAgICAgUmVnaW9uOiBDb25zdGFudHMuQVdTX1JFR0lPTlxuICAgIH1cblxuICAgIGR5bmFtb0RCLmRlbGV0ZShwYXJhbXMsIChlcnI6IGFueSwgZGF0YTogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gZGVsZXRlIGl0ZW0uIEVycm9yIEpTT046XCIsIEpTT04uc3RyaW5naWZ5KGVyciwgbnVsbCwgMikpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZUl0ZW0gc3VjY2VlZGVkOlwiLCBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG59XG5cbiJdfQ==