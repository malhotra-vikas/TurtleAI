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
const Constants = __importStar(require("../src/utils/constants"));
// Import your AWS Lambda handler function
//import { main } from '../src/lambda/create-contact' // Replace with your actual Lambda code
const myHandler = require('../src/lambda/get-contacts').retrieveContactHandler;
const LambdaTester = require('lambda-tester');
const lambdaEvent_ValidEmail = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        email: 'DO-NOT-DELETE@citypt.com'
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
const lambdaEvent_ValidContact = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        contactId: 'f115df1e-f210-42b7-92d2-29063079cf02'
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
const lambdaEvent_NonExistentEmail = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        email: 'dddsjohndoe@gmail.com'
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
const lambdaEvent_NonExistentContact = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        contactId: 'sdf@gmail.com'
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
const lambdaEvent_InValidEmail = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        email: 'dddsjohndoegmail.com'
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
describe('DynamoDB Retrieve Action in Lambda', () => {
    // Initialize AWS SDK
    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    });
    // Cleanup after tests
    afterAll(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });
    it('Should retrieve an item with email within Lambda - lambdaEvent_ValidEmail', async () => {
        const mockFetchItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem);
        return LambdaTester(myHandler)
            .event(lambdaEvent_ValidEmail)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should retrieve an item with contactId within Lambda - lambdaEvent_ValidContact', async () => {
        const mockFetchItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem);
        return LambdaTester(myHandler)
            .event(lambdaEvent_ValidContact)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Testing retrieve with non existent email within Lambda - lambdaEvent_NonExistentEmail', async () => {
        const mockFetchItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem);
        return LambdaTester(myHandler)
            .event(lambdaEvent_NonExistentEmail)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.DOES_NOT_EXIST);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Testing retrieve with non existent contactId within Lambda - lambdaEvent_NonExistentContact', async () => {
        const mockFetchItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem);
        return LambdaTester(myHandler)
            .event(lambdaEvent_NonExistentContact)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.DOES_NOT_EXIST);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Testing retrieve with email within Lambda - lambdaEvent_InValidEmail', async () => {
        const mockFetchItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem);
        return LambdaTester(myHandler)
            .event(lambdaEvent_InValidEmail)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.INTERNAL_ERROR);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS1nZXQtY29udGFjdHMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvMS1nZXQtY29udGFjdHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUU5QixrRUFBbUQ7QUFFbkQsMENBQTBDO0FBQzFDLDZGQUE2RjtBQUM3RixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQTtBQUM5RSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7QUFHN0MsTUFBTSxzQkFBc0IsR0FBRztJQUM5QixJQUFJLEVBQUUsRUFBRTtJQUNSLE9BQU8sRUFBRTtRQUNSLGNBQWMsRUFBRSxrQkFBa0I7S0FDbEM7SUFDRCxVQUFVLEVBQUUsTUFBTTtJQUNsQixlQUFlLEVBQUUsS0FBSztJQUN0QixJQUFJLEVBQUUscUJBQXFCO0lBQzNCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLHFCQUFxQixFQUFFO1FBQ3RCLEtBQUssRUFBRSwwQkFBMEI7S0FDakM7SUFDRCxjQUFjLEVBQUU7UUFDZixTQUFTLEVBQUUsaUJBQWlCO1FBQzVCLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUIsS0FBSyxFQUFFLFlBQVk7UUFDbkIsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixRQUFRLEVBQUU7WUFDVCxxQkFBcUIsRUFBRSxJQUFJO1lBQzNCLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixNQUFNLEVBQUUsSUFBSTtZQUNaLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIseUJBQXlCLEVB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QUMsU0FBUyxDQUFDO2FBQzVCLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQzthQUMvQixhQUFhLENBQUMsQ0FBQyxNQUE2QixFQUFFLEVBQUU7WUFDaEQsaURBQWlEO1lBQ2pELDhEQUE4RDtZQUM5RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUgsb0ZBQW9GO0lBQ3JGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1NNb2NrID0gcmVxdWlyZSgnYXdzLXNkay1tb2NrJylcbmNvbnN0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQgfSBmcm9tICdhd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4uL3NyYy91dGlscy9jb25zdGFudHMnXG5cbi8vIEltcG9ydCB5b3VyIEFXUyBMYW1iZGEgaGFuZGxlciBmdW5jdGlvblxuLy9pbXBvcnQgeyBtYWluIH0gZnJvbSAnLi4vc3JjL2xhbWJkYS9jcmVhdGUtY29udGFjdCcgLy8gUmVwbGFjZSB3aXRoIHlvdXIgYWN0dWFsIExhbWJkYSBjb2RlXG5jb25zdCBteUhhbmRsZXIgPSByZXF1aXJlKCcuLi9zcmMvbGFtYmRhL2dldC1jb250YWN0cycpLnJldHJpZXZlQ29udGFjdEhhbmRsZXJcbmNvbnN0IExhbWJkYVRlc3RlciA9IHJlcXVpcmUoJ2xhbWJkYS10ZXN0ZXInKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSBcImF3cy1sYW1iZGFcIlxuXG5jb25zdCBsYW1iZGFFdmVudF9WYWxpZEVtYWlsID0ge1xuXHRib2R5OiAnJyxcblx0aGVhZGVyczoge1xuXHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0fSxcblx0aHR0cE1ldGhvZDogJ1BPU1QnLFxuXHRpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuXHRwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG5cdHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuXHRxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcblx0XHRlbWFpbDogJ0RPLU5PVC1ERUxFVEVAY2l0eXB0LmNvbSdcblx0fSxcblx0cmVxdWVzdENvbnRleHQ6IHtcblx0XHRhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuXHRcdHJlc291cmNlSWQ6ICd5b3VyLXJlc291cmNlLWlkJyxcblx0XHRzdGFnZTogJ3lvdXItc3RhZ2UnLFxuXHRcdHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG5cdFx0aWRlbnRpdHk6IHtcblx0XHRcdGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcblx0XHRcdGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG5cdFx0XHRjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcblx0XHRcdGNhbGxlcjogbnVsbCxcblx0XHRcdHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcblx0XHRcdHByaW5jaXBhbE9yZ0lkOiBudWxsLFxuXHRcdFx0YWNjZXNzS2V5OiAneW91ci1hY2Nlc3Mta2V5Jyxcblx0XHRcdGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG5cdFx0XHRjb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcjogbnVsbCxcblx0XHRcdHVzZXJBcm46ICd5b3VyLXVzZXItYXJuJyxcblx0XHRcdHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuXHRcdFx0dXNlcjogJ3lvdXItdXNlcicsXG5cdFx0XHRhcGlLZXk6IG51bGwsXG5cdFx0XHRhcGlLZXlJZDogbnVsbCxcblx0XHRcdGNsaWVudENlcnQ6IG51bGxcblx0XHR9LFxuXHRcdGFwaUlkOiAneW91ci1hcGktaWQnLFxuXHRcdGF1dGhvcml6ZXI6IG51bGwsXG5cdFx0cHJvdG9jb2w6ICdIVFRQLzEuMScsXG5cdFx0aHR0cE1ldGhvZDogJ1BPU1QnLFxuXHRcdHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcblx0XHRyZXF1ZXN0VGltZUVwb2NoOiAxNjc5MjUxMTk4MDAwLFxuXHRcdHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcblx0fSxcblx0bXVsdGlWYWx1ZUhlYWRlcnM6IHt9LFxuXHRtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcblx0c3RhZ2VWYXJpYWJsZXM6IG51bGwsXG5cdHJlc291cmNlOiAneW91ci1yZXNvdXJjZSdcbn1cblxuY29uc3QgIGxhbWJkYUV2ZW50X1ZhbGlkQ29udGFjdCA9IHtcblx0Ym9keTogJycsXG5cdGhlYWRlcnM6IHtcblx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdH0sXG5cdGh0dHBNZXRob2Q6ICdQT1NUJyxcblx0aXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcblx0cGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuXHRwYXRoUGFyYW1ldGVyczogbnVsbCxcblx0cXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7XG5cdFx0Y29udGFjdElkOiAnZjExNWRmMWUtZjIxMC00MmI3LTkyZDItMjkwNjMwNzljZjAyJ1xuXHR9LFxuXHRyZXF1ZXN0Q29udGV4dDoge1xuXHRcdGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG5cdFx0cmVzb3VyY2VJZDogJ3lvdXItcmVzb3VyY2UtaWQnLFxuXHRcdHN0YWdlOiAneW91ci1zdGFnZScsXG5cdFx0cmVxdWVzdElkOiAneW91ci1yZXF1ZXN0LWlkJyxcblx0XHRpZGVudGl0eToge1xuXHRcdFx0Y29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuXHRcdFx0YWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcblx0XHRcdGNvZ25pdG9JZGVudGl0eUlkOiBudWxsLFxuXHRcdFx0Y2FsbGVyOiBudWxsLFxuXHRcdFx0c291cmNlSXA6ICcxMjcuMC4wLjEnLFxuXHRcdFx0cHJpbmNpcGFsT3JnSWQ6IG51bGwsXG5cdFx0XHRhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuXHRcdFx0Y29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZTogbnVsbCxcblx0XHRcdGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiBudWxsLFxuXHRcdFx0dXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuXHRcdFx0dXNlckFnZW50OiAndXNlci1hZ2VudCcsXG5cdFx0XHR1c2VyOiAneW91ci11c2VyJyxcblx0XHRcdGFwaUtleTogbnVsbCxcblx0XHRcdGFwaUtleUlkOiBudWxsLFxuXHRcdFx0Y2xpZW50Q2VydDogbnVsbFxuXHRcdH0sXG5cdFx0YXBpSWQ6ICd5b3VyLWFwaS1pZCcsXG5cdFx0YXV0aG9yaXplcjogbnVsbCxcblx0XHRwcm90b2NvbDogJ0hUVFAvMS4xJyxcblx0XHRodHRwTWV0aG9kOiAnUE9TVCcsXG5cdFx0cGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuXHRcdHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG5cdFx0cmVzb3VyY2VQYXRoOiAnL3twcm94eSt9J1xuXHR9LFxuXHRtdWx0aVZhbHVlSGVhZGVyczoge30sXG5cdG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHt9LFxuXHRzdGFnZVZhcmlhYmxlczogbnVsbCxcblx0cmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xufVxuXG5jb25zdCBsYW1iZGFFdmVudF9Ob25FeGlzdGVudEVtYWlsID0ge1xuXHRib2R5OiAnJyxcblx0aGVhZGVyczoge1xuXHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0fSxcblx0aHR0cE1ldGhvZDogJ1BPU1QnLFxuXHRpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuXHRwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG5cdHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuXHRxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcblx0XHRlbWFpbDogJ2RkZHNqb2huZG9lQGdtYWlsLmNvbSdcblx0fSxcblx0cmVxdWVzdENvbnRleHQ6IHtcblx0XHRhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuXHRcdHJlc291cmNlSWQ6ICd5b3VyLXJlc291cmNlLWlkJyxcblx0XHRzdGFnZTogJ3lvdXItc3RhZ2UnLFxuXHRcdHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG5cdFx0aWRlbnRpdHk6IHtcblx0XHRcdGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcblx0XHRcdGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG5cdFx0XHRjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcblx0XHRcdGNhbGxlcjogbnVsbCxcblx0XHRcdHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcblx0XHRcdHByaW5jaXBhbE9yZ0lkOiBudWxsLFxuXHRcdFx0YWNjZXNzS2V5OiAneW91ci1hY2Nlc3Mta2V5Jyxcblx0XHRcdGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG5cdFx0XHRjb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcjogbnVsbCxcblx0XHRcdHVzZXJBcm46ICd5b3VyLXVzZXItYXJuJyxcblx0XHRcdHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuXHRcdFx0dXNlcjogJ3lvdXItdXNlcicsXG5cdFx0XHRhcGlLZXk6IG51bGwsXG5cdFx0XHRhcGlLZXlJZDogbnVsbCxcblx0XHRcdGNsaWVudENlcnQ6IG51bGxcblx0XHR9LFxuXHRcdGFwaUlkOiAneW91ci1hcGktaWQnLFxuXHRcdGF1dGhvcml6ZXI6IG51bGwsXG5cdFx0cHJvdG9jb2w6ICdIVFRQLzEuMScsXG5cdFx0aHR0cE1ldGhvZDogJ1BPU1QnLFxuXHRcdHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcblx0XHRyZXF1ZXN0VGltZUVwb2NoOiAxNjc5MjUxMTk4MDAwLFxuXHRcdHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcblx0fSxcblx0bXVsdGlWYWx1ZUhlYWRlcnM6IHt9LFxuXHRtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcblx0c3RhZ2VWYXJpYWJsZXM6IG51bGwsXG5cdHJlc291cmNlOiAneW91ci1yZXNvdXJjZSdcbn1cblxuY29uc3QgbGFtYmRhRXZlbnRfTm9uRXhpc3RlbnRDb250YWN0ID0ge1xuXHRib2R5OiAnJyxcblx0aGVhZGVyczoge1xuXHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0fSxcblx0aHR0cE1ldGhvZDogJ1BPU1QnLFxuXHRpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuXHRwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG5cdHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuXHRxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcblx0XHRjb250YWN0SWQ6ICdzZGZAZ21haWwuY29tJ1xuXHR9LFxuXHRyZXF1ZXN0Q29udGV4dDoge1xuXHRcdGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG5cdFx0cmVzb3VyY2VJZDogJ3lvdXItcmVzb3VyY2UtaWQnLFxuXHRcdHN0YWdlOiAneW91ci1zdGFnZScsXG5cdFx0cmVxdWVzdElkOiAneW91ci1yZXF1ZXN0LWlkJyxcblx0XHRpZGVudGl0eToge1xuXHRcdFx0Y29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuXHRcdFx0YWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcblx0XHRcdGNvZ25pdG9JZGVudGl0eUlkOiBudWxsLFxuXHRcdFx0Y2FsbGVyOiBudWxsLFxuXHRcdFx0c291cmNlSXA6ICcxMjcuMC4wLjEnLFxuXHRcdFx0cHJpbmNpcGFsT3JnSWQ6IG51bGwsXG5cdFx0XHRhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuXHRcdFx0Y29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZTogbnVsbCxcblx0XHRcdGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiBudWxsLFxuXHRcdFx0dXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuXHRcdFx0dXNlckFnZW50OiAndXNlci1hZ2VudCcsXG5cdFx0XHR1c2VyOiAneW91ci11c2VyJyxcblx0XHRcdGFwaUtleTogbnVsbCxcblx0XHRcdGFwaUtleUlkOiBudWxsLFxuXHRcdFx0Y2xpZW50Q2VydDogbnVsbFxuXHRcdH0sXG5cdFx0YXBpSWQ6ICd5b3VyLWFwaS1pZCcsXG5cdFx0YXV0aG9yaXplcjogbnVsbCxcblx0XHRwcm90b2NvbDogJ0hUVFAvMS4xJyxcblx0XHRodHRwTWV0aG9kOiAnUE9TVCcsXG5cdFx0cGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuXHRcdHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG5cdFx0cmVzb3VyY2VQYXRoOiAnL3twcm94eSt9J1xuXHR9LFxuXHRtdWx0aVZhbHVlSGVhZGVyczoge30sXG5cdG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHt9LFxuXHRzdGFnZVZhcmlhYmxlczogbnVsbCxcblx0cmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xufVxuXG5jb25zdCBsYW1iZGFFdmVudF9JblZhbGlkRW1haWwgPSB7XG5cdGJvZHk6ICcnLFxuXHRoZWFkZXJzOiB7XG5cdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHR9LFxuXHRodHRwTWV0aG9kOiAnUE9TVCcsXG5cdGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG5cdHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcblx0cGF0aFBhcmFtZXRlcnM6IG51bGwsXG5cdHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge1xuXHRcdGVtYWlsOiAnZGRkc2pvaG5kb2VnbWFpbC5jb20nXG5cdH0sXG5cdHJlcXVlc3RDb250ZXh0OiB7XG5cdFx0YWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcblx0XHRyZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG5cdFx0c3RhZ2U6ICd5b3VyLXN0YWdlJyxcblx0XHRyZXF1ZXN0SWQ6ICd5b3VyLXJlcXVlc3QtaWQnLFxuXHRcdGlkZW50aXR5OiB7XG5cdFx0XHRjb2duaXRvSWRlbnRpdHlQb29sSWQ6IG51bGwsXG5cdFx0XHRhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuXHRcdFx0Y29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG5cdFx0XHRjYWxsZXI6IG51bGwsXG5cdFx0XHRzb3VyY2VJcDogJzEyNy4wLjAuMScsXG5cdFx0XHRwcmluY2lwYWxPcmdJZDogbnVsbCxcblx0XHRcdGFjY2Vzc0tleTogJ3lvdXItYWNjZXNzLWtleScsXG5cdFx0XHRjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuXHRcdFx0Y29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG5cdFx0XHR1c2VyQXJuOiAneW91ci11c2VyLWFybicsXG5cdFx0XHR1c2VyQWdlbnQ6ICd1c2VyLWFnZW50Jyxcblx0XHRcdHVzZXI6ICd5b3VyLXVzZXInLFxuXHRcdFx0YXBpS2V5OiBudWxsLFxuXHRcdFx0YXBpS2V5SWQ6IG51bGwsXG5cdFx0XHRjbGllbnRDZXJ0OiBudWxsXG5cdFx0fSxcblx0XHRhcGlJZDogJ3lvdXItYXBpLWlkJyxcblx0XHRhdXRob3JpemVyOiBudWxsLFxuXHRcdHByb3RvY29sOiAnSFRUUC8xLjEnLFxuXHRcdGh0dHBNZXRob2Q6ICdQT1NUJyxcblx0XHRwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG5cdFx0cmVxdWVzdFRpbWVFcG9jaDogMTY3OTI1MTE5ODAwMCxcblx0XHRyZXNvdXJjZVBhdGg6ICcve3Byb3h5K30nXG5cdH0sXG5cdG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcblx0bXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge30sXG5cdHN0YWdlVmFyaWFibGVzOiBudWxsLFxuXHRyZXNvdXJjZTogJ3lvdXItcmVzb3VyY2UnXG59XG5cblxuZGVzY3JpYmUoJ0R5bmFtb0RCIFJldHJpZXZlIEFjdGlvbiBpbiBMYW1iZGEnLCAoKSA9PiB7XG5cdC8vIEluaXRpYWxpemUgQVdTIFNES1xuXHRiZWZvcmVBbGwoKCkgPT4ge1xuXHRcdEFXU01vY2suc2V0U0RLSW5zdGFuY2UoQVdTKVxuXHR9KVxuXG5cdC8vIENsZWFudXAgYWZ0ZXIgdGVzdHNcblx0YWZ0ZXJBbGwoKCkgPT4ge1xuXHRcdEFXU01vY2sucmVzdG9yZSgnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnKVxuXHR9KVxuXG5cdGl0KCdTaG91bGQgcmV0cmlldmUgYW4gaXRlbSB3aXRoIGVtYWlsIHdpdGhpbiBMYW1iZGEgLSBsYW1iZGFFdmVudF9WYWxpZEVtYWlsJywgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IG1vY2tGZXRjaEl0ZW0gPSBqZXN0LmZuKClcblx0XHRBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ2dldCcsIG1vY2tGZXRjaEl0ZW0pXG5cblx0XHRyZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcblx0XHRcdC5ldmVudChsYW1iZGFFdmVudF9WYWxpZEVtYWlsKVxuXHRcdFx0LmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG5cdFx0XHRcdC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0Ly9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXHRcdFx0XHRleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLlNVQ0NFU1MpXG5cdFx0XHR9KVxuXG5cdFx0Ly8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG5cdH0pXG5cblx0aXQoJ1Nob3VsZCByZXRyaWV2ZSBhbiBpdGVtIHdpdGggY29udGFjdElkIHdpdGhpbiBMYW1iZGEgLSBsYW1iZGFFdmVudF9WYWxpZENvbnRhY3QnLCBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgbW9ja0ZldGNoSXRlbSA9IGplc3QuZm4oKVxuXHRcdEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAnZ2V0JywgbW9ja0ZldGNoSXRlbSlcblxuXHRcdHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuXHRcdFx0LmV2ZW50KGxhbWJkYUV2ZW50X1ZhbGlkQ29udGFjdClcblx0XHRcdC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuXHRcdFx0XHQvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5TVUNDRVNTKVxuXHRcdFx0fSlcblxuXHRcdC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuXHR9KVxuXG5cdGl0KCdUZXN0aW5nIHJldHJpZXZlIHdpdGggbm9uIGV4aXN0ZW50IGVtYWlsIHdpdGhpbiBMYW1iZGEgLSBsYW1iZGFFdmVudF9Ob25FeGlzdGVudEVtYWlsJywgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IG1vY2tGZXRjaEl0ZW0gPSBqZXN0LmZuKClcblx0XHRBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ2dldCcsIG1vY2tGZXRjaEl0ZW0pXG5cblx0XHRyZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcblx0XHRcdC5ldmVudChsYW1iZGFFdmVudF9Ob25FeGlzdGVudEVtYWlsKVxuXHRcdFx0LmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG5cdFx0XHRcdC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0Ly9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXHRcdFx0XHRleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLkRPRVNfTk9UX0VYSVNUKVxuXHRcdFx0fSlcblxuXHRcdC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuXHR9KVxuXG5cdGl0KCdUZXN0aW5nIHJldHJpZXZlIHdpdGggbm9uIGV4aXN0ZW50IGNvbnRhY3RJZCB3aXRoaW4gTGFtYmRhIC0gbGFtYmRhRXZlbnRfTm9uRXhpc3RlbnRDb250YWN0JywgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IG1vY2tGZXRjaEl0ZW0gPSBqZXN0LmZuKClcblx0XHRBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ2dldCcsIG1vY2tGZXRjaEl0ZW0pXG5cblxuXHRcdHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuXHRcdFx0LmV2ZW50KGxhbWJkYUV2ZW50X05vbkV4aXN0ZW50Q29udGFjdClcblx0XHRcdC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuXHRcdFx0XHQvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5ET0VTX05PVF9FWElTVClcblx0XHRcdH0pXG5cblx0XHQvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cblx0fSlcblxuXHRpdCgnVGVzdGluZyByZXRyaWV2ZSB3aXRoIGVtYWlsIHdpdGhpbiBMYW1iZGEgLSBsYW1iZGFFdmVudF9JblZhbGlkRW1haWwnLCBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgbW9ja0ZldGNoSXRlbSA9IGplc3QuZm4oKVxuXHRcdEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAnZ2V0JywgbW9ja0ZldGNoSXRlbSlcblxuXG5cdFx0cmV0dXJuIExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG5cdFx0XHQuZXZlbnQobGFtYmRhRXZlbnRfSW5WYWxpZEVtYWlsKVxuXHRcdFx0LmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG5cdFx0XHRcdC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0Ly9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXHRcdFx0XHRleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLklOVEVSTkFMX0VSUk9SKVxuXHRcdFx0fSlcblxuXHRcdC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuXHR9KVxufSlcbiJdfQ==