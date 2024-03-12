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
const myHandler = require('../src/lambda/update-contact-subscriptions').updateContactSubscriptionsHandler;
const LambdaTester = require('lambda-tester');
const Add_item_WithInvalidEmail = {
    'email': 'TESsT-johndoe@gmail.com',
};
const Add_item_WithNonExistentEmail = {
    'email': 'john@doegmail.com',
};
const Add_item_WithInvalidContactId = {
    'contactId': 123,
};
const Add_item_WithNonExistentContactId = {
    'email': 'jodshn@doegmail.com',
};
const Add_item_WithNoData = {};
let Add_lambdaEvent_WithValidList = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        listId: 'List123'
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
let Delete_lambdaEvent_WithValidList = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'DELETE',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        listId: 'List123'
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
let Delete_lambdaEvent_WithNonExistingList = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'DELETE',
    isBase64Encoded: false,
    path: '/your-resource-path',
    pathParameters: null,
    queryStringParameters: {
        listId: 'List1d23'
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
describe('DynamoDB Update Action in Lambda', () => {
    // Initialize AWS SDK
    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    });
    // Cleanup after tests
    afterAll(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });
    it('Should update an item subscription with email to DynamoDB within Lambda', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        const item = {
            'email': 'DO-NOT-DELETE@citypt.com',
        };
        const lambdaEvent = {
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            },
            httpMethod: 'POST',
            isBase64Encoded: false,
            path: '/your-resource-path',
            pathParameters: null,
            queryStringParameters: {
                listId: 'List123'
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
    it('Should update an item subscription with contact id to DynamoDB within Lambda', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        const item = {
            'contactId': 'f115df1e-f210-42b7-92d2-29063079cf02',
        };
        const lambdaEvent = {
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            },
            httpMethod: 'POST',
            isBase64Encoded: false,
            path: '/your-resource-path',
            pathParameters: null,
            queryStringParameters: {
                listId: 'List456'
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
    it('Should delete an item subscription with contact id to DynamoDB within Lambda', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        const item = {
            'contactId': 'f115df1e-f210-42b7-92d2-29063079cf02',
        };
        const lambdaEvent = {
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            },
            httpMethod: 'DELETE',
            isBase64Encoded: false,
            path: '/your-resource-path',
            pathParameters: null,
            queryStringParameters: {
                listId: 'List456'
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
    it('Should delete an item subscription with email to DynamoDB within Lambda', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        const item = {
            'email': 'DO-NOT-DELETE@citypt.com',
        };
        const lambdaEvent = {
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            },
            httpMethod: 'DELETE',
            isBase64Encoded: false,
            path: '/your-resource-path',
            pathParameters: null,
            queryStringParameters: {
                listId: 'List123'
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
    it('Should try to delete an nonexistent item subscription with contact id to DynamoDB within Lambda', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        const item = {
            'contactId': 'f115df1e-f210-42b7-92d2-29063079cf02',
        };
        const lambdaEvent = {
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            },
            httpMethod: 'DELETE',
            isBase64Encoded: false,
            path: '/your-resource-path',
            pathParameters: null,
            queryStringParameters: {
                listId: 'List4536'
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
    it('Should try to delete an nonexistent sitem subscription with email to DynamoDB within Lambda', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        const item = {
            'email': 'DO-NOT-DELETE@citypt.com',
        };
        const lambdaEvent = {
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            },
            httpMethod: 'DELETE',
            isBase64Encoded: false,
            path: '/your-resource-path',
            pathParameters: null,
            queryStringParameters: {
                listId: 'Lisst123'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy11cGRhdGUtY29udGFjdC1zdWJzY3JpcHRpb25zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0LzMtdXBkYXRlLWNvbnRhY3Qtc3Vic2NyaXB0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdkMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzlCLGtFQUFtRDtBQUVuRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQTtBQUN6RyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7QUFHN0MsTUFBTSx5QkFBeUIsR0FBRztJQUNoQyxPQUFPLEVBQUUseUJBQXlCO0NBQ25DLENBQUE7QUFFRCxNQUFNLDZCQUE2QixHQUFHO0lBQ3BDLE9BQU8sRUFBRSxtQkFBbUI7Q0FDN0IsQ0FBQTtBQUVELE1BQU0sNkJBQTZCLEdBQUc7SUFDcEMsV0FBVyxFQUFFLEdBQUc7Q0FDakIsQ0FBQTtBQUVELE1BQU0saUNBQWlDLEdBQUc7SUFDeEMsT0FBTyxFQUFFLHFCQUFxQjtDQUMvQixDQUFBO0FBRUQsTUFBTSxtQkFBbUIsR0FBRyxFQUMzQixDQUFBO0FBRUQsSUFBSSw2QkFBNkIsR0FBRztJQUNsQyxJQUFJLEVBQUUsRUFBRTtJQUNSLE9BQU8sRUFBRTtRQUNQLGNBQWMsRUFBRSxrQkFBa0I7S0FDbkM7SUFDRCxVQUFVLEVBQUUsTUFBTTtJQUNsQixlQUFlLEVBQUUsS0FBSztJQUN0QixJQUFJLEVBQUUscUJBQXFCO0lBQzNCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLHFCQUFxQixFQUFFO1FBQ3JCLE1BQU0sRUFBRSxTQUFTO0tBQ2xCO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsU0FBUyxFQUFF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O29CQUNyQixjQUFjLEVBQUUsSUFBSTtvQkFDcEIsU0FBUyxFQUFFLGlCQUFpQjtvQkFDNUIseUJBQXlCLEVBQUUsSUFBSTtvQkFDL0IsNkJBQTZCLEVBQUUsSUFBSTtvQkFDbkMsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFNBQVMsRUFBRSxZQUFZO29CQUN2QixJQUFJLEVBQUUsV0FBVztvQkFDakIsTUFBTSxFQUFFLElBQUk7b0JBQ1osUUFBUSxFQUFFLElBQUk7b0JBQ2QsVUFBVSxFQUFFLElBQUk7aUJBQ2pCO2dCQUNELEtBQUssRUFBRSxhQUFhO2dCQUNwQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixJQUFJLEVBQUUscUJBQXFCO2dCQUMzQixnQkFBZ0IsRUFBRSxhQUFhO2dCQUMvQixZQUFZLEVBQUUsV0FBVzthQUMxQjtZQUNELGlCQUFpQixFQUFFLEVBQUU7WUFDckIsK0JBQStCLEVBQUUsRUFBRTtZQUNuQyxjQUFjLEVBQUUsSUFBSTtZQUNwQixRQUFRLEVBQUUsZUFBZTtTQUMxQixDQUFBO1FBRUQsT0FBTyxZQUFZLENBQUMsU0FBUyxDQUFDO2FBQzNCLEtBQUssQ0FBQyxXQUFXLENBQUM7YUFDbEIsYUFBYSxDQUFDLENBQUMsTUFBNkIsRUFBRSxFQUFFO1lBQy9DLGlEQUFpRDtZQUNqRCw4REFBOEQ7WUFDOUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNqRCxDQUFDLENBQUMsQ0FBQTtRQUVKLG9GQUFvRjtJQUN0RixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVdTTW9jayA9IHJlcXVpcmUoJ2F3cy1zZGstbW9jaycpXG5jb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJylcbmltcG9ydCAqIGFzIENvbnN0YW50cyBmcm9tICcuLi9zcmMvdXRpbHMvY29uc3RhbnRzJ1xuXG5jb25zdCBteUhhbmRsZXIgPSByZXF1aXJlKCcuLi9zcmMvbGFtYmRhL3VwZGF0ZS1jb250YWN0LXN1YnNjcmlwdGlvbnMnKS51cGRhdGVDb250YWN0U3Vic2NyaXB0aW9uc0hhbmRsZXJcbmNvbnN0IExhbWJkYVRlc3RlciA9IHJlcXVpcmUoJ2xhbWJkYS10ZXN0ZXInKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSBcImF3cy1sYW1iZGFcIlxuXG5jb25zdCBBZGRfaXRlbV9XaXRoSW52YWxpZEVtYWlsID0ge1xuICAnZW1haWwnOiAnVEVTc1Qtam9obmRvZUBnbWFpbC5jb20nLFxufVxuXG5jb25zdCBBZGRfaXRlbV9XaXRoTm9uRXhpc3RlbnRFbWFpbCA9IHtcbiAgJ2VtYWlsJzogJ2pvaG5AZG9lZ21haWwuY29tJyxcbn1cblxuY29uc3QgQWRkX2l0ZW1fV2l0aEludmFsaWRDb250YWN0SWQgPSB7XG4gICdjb250YWN0SWQnOiAxMjMsXG59XG5cbmNvbnN0IEFkZF9pdGVtX1dpdGhOb25FeGlzdGVudENvbnRhY3RJZCA9IHtcbiAgJ2VtYWlsJzogJ2pvZHNobkBkb2VnbWFpbC5jb20nLFxufVxuXG5jb25zdCBBZGRfaXRlbV9XaXRoTm9EYXRhID0ge1xufVxuXG5sZXQgQWRkX2xhbWJkYUV2ZW50X1dpdGhWYWxpZExpc3QgPSB7XG4gIGJvZHk6ICcnLFxuICBoZWFkZXJzOiB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9LFxuICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgcGF0aFBhcmFtZXRlcnM6IG51bGwsXG4gIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge1xuICAgIGxpc3RJZDogJ0xpc3QxMjMnXG4gIH0sXG4gIHJlcXVlc3RDb250ZXh0OiB7XG4gICAgYWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcbiAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgc3RhZ2U6ICd5b3VyLXN0YWdlJyxcbiAgICByZXF1ZXN0SWQ6ICd5b3VyLXJlcXVlc3QtaWQnLFxuICAgIGlkZW50aXR5OiB7XG4gICAgICBjb2duaXRvSWRlbnRpdHlQb29sSWQ6IG51bGwsXG4gICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICBjYWxsZXI6IG51bGwsXG4gICAgICBzb3VyY2VJcDogJzEyNy4wLjAuMScsXG4gICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgIGFjY2Vzc0tleTogJ3lvdXItYWNjZXNzLWtleScsXG4gICAgICBjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICB1c2VyQXJuOiAneW91ci11c2VyLWFybicsXG4gICAgICB1c2VyQWdlbnQ6ICd1c2VyLWFnZW50JyxcbiAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgYXBpS2V5OiBudWxsLFxuICAgICAgYXBpS2V5SWQ6IG51bGwsXG4gICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgfSxcbiAgICBhcGlJZDogJ3lvdXItYXBpLWlkJyxcbiAgICBhdXRob3JpemVyOiBudWxsLFxuICAgIHByb3RvY29sOiAnSFRUUC8xLjEnLFxuICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgcmVxdWVzdFRpbWVFcG9jaDogMTY3OTI1MTE5ODAwMCxcbiAgICByZXNvdXJjZVBhdGg6ICcve3Byb3h5K30nXG4gIH0sXG4gIG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcbiAgbXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge30sXG4gIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICByZXNvdXJjZTogJ3lvdXItcmVzb3VyY2UnXG59XG5cbmxldCBEZWxldGVfbGFtYmRhRXZlbnRfV2l0aFZhbGlkTGlzdCA9IHtcbiAgYm9keTogJycsXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH0sXG4gIGh0dHBNZXRob2Q6ICdERUxFVEUnLFxuICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gIHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcbiAgICBsaXN0SWQ6ICdMaXN0MTIzJ1xuICB9LFxuICByZXF1ZXN0Q29udGV4dDoge1xuICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgcmVzb3VyY2VJZDogJ3lvdXItcmVzb3VyY2UtaWQnLFxuICAgIHN0YWdlOiAneW91ci1zdGFnZScsXG4gICAgcmVxdWVzdElkOiAneW91ci1yZXF1ZXN0LWlkJyxcbiAgICBpZGVudGl0eToge1xuICAgICAgY29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuICAgICAgYWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcbiAgICAgIGNvZ25pdG9JZGVudGl0eUlkOiBudWxsLFxuICAgICAgY2FsbGVyOiBudWxsLFxuICAgICAgc291cmNlSXA6ICcxMjcuMC4wLjEnLFxuICAgICAgcHJpbmNpcGFsT3JnSWQ6IG51bGwsXG4gICAgICBhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZTogbnVsbCxcbiAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiBudWxsLFxuICAgICAgdXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuICAgICAgdXNlckFnZW50OiAndXNlci1hZ2VudCcsXG4gICAgICB1c2VyOiAneW91ci11c2VyJyxcbiAgICAgIGFwaUtleTogbnVsbCxcbiAgICAgIGFwaUtleUlkOiBudWxsLFxuICAgICAgY2xpZW50Q2VydDogbnVsbFxuICAgIH0sXG4gICAgYXBpSWQ6ICd5b3VyLWFwaS1pZCcsXG4gICAgYXV0aG9yaXplcjogbnVsbCxcbiAgICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcbiAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICAgIHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG4gICAgcmVzb3VyY2VQYXRoOiAnL3twcm94eSt9J1xuICB9LFxuICBtdWx0aVZhbHVlSGVhZGVyczoge30sXG4gIG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHt9LFxuICBzdGFnZVZhcmlhYmxlczogbnVsbCxcbiAgcmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xufVxuXG5sZXQgRGVsZXRlX2xhbWJkYUV2ZW50X1dpdGhOb25FeGlzdGluZ0xpc3QgPSB7XG4gIGJvZHk6ICcnLFxuICBoZWFkZXJzOiB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9LFxuICBodHRwTWV0aG9kOiAnREVMRVRFJyxcbiAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICBwYXRoUGFyYW1ldGVyczogbnVsbCxcbiAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7XG4gICAgbGlzdElkOiAnTGlzdDFkMjMnXG4gIH0sXG4gIHJlcXVlc3RDb250ZXh0OiB7XG4gICAgYWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcbiAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgc3RhZ2U6ICd5b3VyLXN0YWdlJyxcbiAgICByZXF1ZXN0SWQ6ICd5b3VyLXJlcXVlc3QtaWQnLFxuICAgIGlkZW50aXR5OiB7XG4gICAgICBjb2duaXRvSWRlbnRpdHlQb29sSWQ6IG51bGwsXG4gICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICBjYWxsZXI6IG51bGwsXG4gICAgICBzb3VyY2VJcDogJzEyNy4wLjAuMScsXG4gICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgIGFjY2Vzc0tleTogJ3lvdXItYWNjZXNzLWtleScsXG4gICAgICBjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICB1c2VyQXJuOiAneW91ci11c2VyLWFybicsXG4gICAgICB1c2VyQWdlbnQ6ICd1c2VyLWFnZW50JyxcbiAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgYXBpS2V5OiBudWxsLFxuICAgICAgYXBpS2V5SWQ6IG51bGwsXG4gICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgfSxcbiAgICBhcGlJZDogJ3lvdXItYXBpLWlkJyxcbiAgICBhdXRob3JpemVyOiBudWxsLFxuICAgIHByb3RvY29sOiAnSFRUUC8xLjEnLFxuICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgcmVxdWVzdFRpbWVFcG9jaDogMTY3OTI1MTE5ODAwMCxcbiAgICByZXNvdXJjZVBhdGg6ICcve3Byb3h5K30nXG4gIH0sXG4gIG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcbiAgbXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge30sXG4gIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICByZXNvdXJjZTogJ3lvdXItcmVzb3VyY2UnXG59XG5cblxuZGVzY3JpYmUoJ0R5bmFtb0RCIFVwZGF0ZSBBY3Rpb24gaW4gTGFtYmRhJywgKCkgPT4ge1xuICAvLyBJbml0aWFsaXplIEFXUyBTREtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBBV1NNb2NrLnNldFNES0luc3RhbmNlKEFXUylcbiAgfSlcblxuICAvLyBDbGVhbnVwIGFmdGVyIHRlc3RzXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICBBV1NNb2NrLnJlc3RvcmUoJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JylcbiAgfSlcblxuICBpdCgnU2hvdWxkIHVwZGF0ZSBhbiBpdGVtIHN1YnNjcmlwdGlvbiB3aXRoIGVtYWlsIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1VwZGF0ZUl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tVcGRhdGVJdGVtKVxuXG4gICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICdlbWFpbCc6ICdETy1OT1QtREVMRVRFQGNpdHlwdC5jb20nLFxuICAgIH1cblxuICAgIGNvbnN0IGxhbWJkYUV2ZW50ID0ge1xuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaXRlbSksXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICAgICAgcGF0aFBhcmFtZXRlcnM6IG51bGwsXG4gICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcbiAgICAgICAgbGlzdElkOiAnTGlzdDEyMydcbiAgICAgIH0sXG4gICAgICByZXF1ZXN0Q29udGV4dDoge1xuICAgICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgICAgIHN0YWdlOiAneW91ci1zdGFnZScsXG4gICAgICAgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG4gICAgICAgIGlkZW50aXR5OiB7XG4gICAgICAgICAgY29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuICAgICAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICAgICAgY2FsbGVyOiBudWxsLFxuICAgICAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgICAgICBhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuICAgICAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG4gICAgICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICAgICAgdXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuICAgICAgICAgIHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuICAgICAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgICAgIGFwaUtleTogbnVsbCxcbiAgICAgICAgICBhcGlLZXlJZDogbnVsbCxcbiAgICAgICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuICAgICAgICBhdXRob3JpemVyOiBudWxsLFxuICAgICAgICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcbiAgICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgICAgIHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG4gICAgICAgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcbiAgICAgIH0sXG4gICAgICBtdWx0aVZhbHVlSGVhZGVyczoge30sXG4gICAgICBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcbiAgICAgIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICAgICAgcmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xuICAgIH1cblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50KVxuICAgICAgLmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG4gICAgICAgIC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgLy9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLlNVQ0NFU1MpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCB1cGRhdGUgYW4gaXRlbSBzdWJzY3JpcHRpb24gd2l0aCBjb250YWN0IGlkIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1VwZGF0ZUl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tVcGRhdGVJdGVtKVxuXG4gICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICdjb250YWN0SWQnOiAnZjExNWRmMWUtZjIxMC00MmI3LTkyZDItMjkwNjMwNzljZjAyJyxcbiAgICB9XG5cbiAgICBjb25zdCBsYW1iZGFFdmVudCA9IHtcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGl0ZW0pLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICAgIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgICAgIHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuICAgICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7XG4gICAgICAgIGxpc3RJZDogJ0xpc3Q0NTYnXG4gICAgICB9LFxuICAgICAgcmVxdWVzdENvbnRleHQ6IHtcbiAgICAgICAgYWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcbiAgICAgICAgcmVzb3VyY2VJZDogJ3lvdXItcmVzb3VyY2UtaWQnLFxuICAgICAgICBzdGFnZTogJ3lvdXItc3RhZ2UnLFxuICAgICAgICByZXF1ZXN0SWQ6ICd5b3VyLXJlcXVlc3QtaWQnLFxuICAgICAgICBpZGVudGl0eToge1xuICAgICAgICAgIGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcbiAgICAgICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgICAgIGNvZ25pdG9JZGVudGl0eUlkOiBudWxsLFxuICAgICAgICAgIGNhbGxlcjogbnVsbCxcbiAgICAgICAgICBzb3VyY2VJcDogJzEyNy4wLjAuMScsXG4gICAgICAgICAgcHJpbmNpcGFsT3JnSWQ6IG51bGwsXG4gICAgICAgICAgYWNjZXNzS2V5OiAneW91ci1hY2Nlc3Mta2V5JyxcbiAgICAgICAgICBjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuICAgICAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiBudWxsLFxuICAgICAgICAgIHVzZXJBcm46ICd5b3VyLXVzZXItYXJuJyxcbiAgICAgICAgICB1c2VyQWdlbnQ6ICd1c2VyLWFnZW50JyxcbiAgICAgICAgICB1c2VyOiAneW91ci11c2VyJyxcbiAgICAgICAgICBhcGlLZXk6IG51bGwsXG4gICAgICAgICAgYXBpS2V5SWQ6IG51bGwsXG4gICAgICAgICAgY2xpZW50Q2VydDogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBhcGlJZDogJ3lvdXItYXBpLWlkJyxcbiAgICAgICAgYXV0aG9yaXplcjogbnVsbCxcbiAgICAgICAgcHJvdG9jb2w6ICdIVFRQLzEuMScsXG4gICAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICAgICAgICByZXF1ZXN0VGltZUVwb2NoOiAxNjc5MjUxMTk4MDAwLFxuICAgICAgICByZXNvdXJjZVBhdGg6ICcve3Byb3h5K30nXG4gICAgICB9LFxuICAgICAgbXVsdGlWYWx1ZUhlYWRlcnM6IHt9LFxuICAgICAgbXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge30sXG4gICAgICBzdGFnZVZhcmlhYmxlczogbnVsbCxcbiAgICAgIHJlc291cmNlOiAneW91ci1yZXNvdXJjZSdcbiAgICB9XG5cbiAgICByZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcbiAgICAgIC5ldmVudChsYW1iZGFFdmVudClcbiAgICAgIC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuICAgICAgICAvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5TVUNDRVNTKVxuICAgICAgfSlcblxuICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuICB9KVxuXG5cbiAgaXQoJ1Nob3VsZCBkZWxldGUgYW4gaXRlbSBzdWJzY3JpcHRpb24gd2l0aCBjb250YWN0IGlkIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1VwZGF0ZUl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tVcGRhdGVJdGVtKVxuXG4gICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICdjb250YWN0SWQnOiAnZjExNWRmMWUtZjIxMC00MmI3LTkyZDItMjkwNjMwNzljZjAyJyxcbiAgICB9XG5cbiAgICBjb25zdCBsYW1iZGFFdmVudCA9IHtcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGl0ZW0pLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgaHR0cE1ldGhvZDogJ0RFTEVURScsXG4gICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICAgICAgcGF0aFBhcmFtZXRlcnM6IG51bGwsXG4gICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcbiAgICAgICAgbGlzdElkOiAnTGlzdDQ1NidcbiAgICAgIH0sXG4gICAgICByZXF1ZXN0Q29udGV4dDoge1xuICAgICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgICAgIHN0YWdlOiAneW91ci1zdGFnZScsXG4gICAgICAgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG4gICAgICAgIGlkZW50aXR5OiB7XG4gICAgICAgICAgY29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuICAgICAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICAgICAgY2FsbGVyOiBudWxsLFxuICAgICAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgICAgICBhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuICAgICAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG4gICAgICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICAgICAgdXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuICAgICAgICAgIHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuICAgICAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgICAgIGFwaUtleTogbnVsbCxcbiAgICAgICAgICBhcGlLZXlJZDogbnVsbCxcbiAgICAgICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuICAgICAgICBhdXRob3JpemVyOiBudWxsLFxuICAgICAgICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcbiAgICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgICAgIHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG4gICAgICAgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcbiAgICAgIH0sXG4gICAgICBtdWx0aVZhbHVlSGVhZGVyczoge30sXG4gICAgICBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcbiAgICAgIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICAgICAgcmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xuICAgIH1cblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50KVxuICAgICAgLmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG4gICAgICAgIC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgLy9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLlNVQ0NFU1MpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCBkZWxldGUgYW4gaXRlbSBzdWJzY3JpcHRpb24gd2l0aCBlbWFpbCB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tVcGRhdGVJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrVXBkYXRlSXRlbSlcblxuICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAnZW1haWwnOiAnRE8tTk9ULURFTEVURUBjaXR5cHQuY29tJyxcbiAgICB9XG5cbiAgICBjb25zdCBsYW1iZGFFdmVudCA9IHtcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGl0ZW0pLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgaHR0cE1ldGhvZDogJ0RFTEVURScsXG4gICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuICAgICAgcGF0aFBhcmFtZXRlcnM6IG51bGwsXG4gICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHtcbiAgICAgICAgbGlzdElkOiAnTGlzdDEyMydcbiAgICAgIH0sXG4gICAgICByZXF1ZXN0Q29udGV4dDoge1xuICAgICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgICAgIHN0YWdlOiAneW91ci1zdGFnZScsXG4gICAgICAgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG4gICAgICAgIGlkZW50aXR5OiB7XG4gICAgICAgICAgY29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuICAgICAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICAgICAgY2FsbGVyOiBudWxsLFxuICAgICAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgICAgICBhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuICAgICAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG4gICAgICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICAgICAgdXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuICAgICAgICAgIHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuICAgICAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgICAgIGFwaUtleTogbnVsbCxcbiAgICAgICAgICBhcGlLZXlJZDogbnVsbCxcbiAgICAgICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuICAgICAgICBhdXRob3JpemVyOiBudWxsLFxuICAgICAgICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcbiAgICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgICAgIHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG4gICAgICAgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcbiAgICAgIH0sXG4gICAgICBtdWx0aVZhbHVlSGVhZGVyczoge30sXG4gICAgICBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcbiAgICAgIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICAgICAgcmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xuICAgIH1cblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50KVxuICAgICAgLmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG4gICAgICAgIC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgLy9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLlNVQ0NFU1MpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCB0cnkgdG8gZGVsZXRlIGFuIG5vbmV4aXN0ZW50IGl0ZW0gc3Vic2NyaXB0aW9uIHdpdGggY29udGFjdCBpZCB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tVcGRhdGVJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrVXBkYXRlSXRlbSlcblxuICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAnY29udGFjdElkJzogJ2YxMTVkZjFlLWYyMTAtNDJiNy05MmQyLTI5MDYzMDc5Y2YwMicsXG4gICAgfVxuXG4gICAgY29uc3QgbGFtYmRhRXZlbnQgPSB7XG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShpdGVtKSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGh0dHBNZXRob2Q6ICdERUxFVEUnLFxuICAgICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICAgIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgICAgIHBhdGhQYXJhbWV0ZXJzOiBudWxsLFxuICAgICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7XG4gICAgICAgIGxpc3RJZDogJ0xpc3Q0NTM2J1xuICAgICAgfSxcbiAgICAgIHJlcXVlc3RDb250ZXh0OiB7XG4gICAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICAgIHJlc291cmNlSWQ6ICd5b3VyLXJlc291cmNlLWlkJyxcbiAgICAgICAgc3RhZ2U6ICd5b3VyLXN0YWdlJyxcbiAgICAgICAgcmVxdWVzdElkOiAneW91ci1yZXF1ZXN0LWlkJyxcbiAgICAgICAgaWRlbnRpdHk6IHtcbiAgICAgICAgICBjb2duaXRvSWRlbnRpdHlQb29sSWQ6IG51bGwsXG4gICAgICAgICAgYWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcbiAgICAgICAgICBjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcbiAgICAgICAgICBjYWxsZXI6IG51bGwsXG4gICAgICAgICAgc291cmNlSXA6ICcxMjcuMC4wLjEnLFxuICAgICAgICAgIHByaW5jaXBhbE9yZ0lkOiBudWxsLFxuICAgICAgICAgIGFjY2Vzc0tleTogJ3lvdXItYWNjZXNzLWtleScsXG4gICAgICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZTogbnVsbCxcbiAgICAgICAgICBjb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcjogbnVsbCxcbiAgICAgICAgICB1c2VyQXJuOiAneW91ci11c2VyLWFybicsXG4gICAgICAgICAgdXNlckFnZW50OiAndXNlci1hZ2VudCcsXG4gICAgICAgICAgdXNlcjogJ3lvdXItdXNlcicsXG4gICAgICAgICAgYXBpS2V5OiBudWxsLFxuICAgICAgICAgIGFwaUtleUlkOiBudWxsLFxuICAgICAgICAgIGNsaWVudENlcnQ6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgYXBpSWQ6ICd5b3VyLWFwaS1pZCcsXG4gICAgICAgIGF1dGhvcml6ZXI6IG51bGwsXG4gICAgICAgIHByb3RvY29sOiAnSFRUUC8xLjEnLFxuICAgICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcbiAgICAgICAgcmVxdWVzdFRpbWVFcG9jaDogMTY3OTI1MTE5ODAwMCxcbiAgICAgICAgcmVzb3VyY2VQYXRoOiAnL3twcm94eSt9J1xuICAgICAgfSxcbiAgICAgIG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcbiAgICAgIG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHt9LFxuICAgICAgc3RhZ2VWYXJpYWJsZXM6IG51bGwsXG4gICAgICByZXNvdXJjZTogJ3lvdXItcmVzb3VyY2UnXG4gICAgfVxuXG4gICAgcmV0dXJuIExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG4gICAgICAuZXZlbnQobGFtYmRhRXZlbnQpXG4gICAgICAuZXhwZWN0UmVzb2x2ZSgocmVzdWx0OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHtcbiAgICAgICAgLy9leHBlY3QoYWRkRW5kcG9pbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICAvL2V4cGVjdChjaGVja0lmRW1haWxBbHJlYWR5RXhpc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZShDb25zdGFudHMuRVJST1IpXG4gICAgICB9KVxuXG4gICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBhZGQgbW9yZSBhc3NlcnRpb25zIGJhc2VkIG9uIHlvdXIgTGFtYmRhIGZ1bmN0aW9uJ3MgYmVoYXZpb3IuXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCB0cnkgdG8gZGVsZXRlIGFuIG5vbmV4aXN0ZW50IHNpdGVtIHN1YnNjcmlwdGlvbiB3aXRoIGVtYWlsIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1VwZGF0ZUl0ZW0gPSBqZXN0LmZuKClcbiAgICBBV1NNb2NrLm1vY2soJ0R5bmFtb0RCLkRvY3VtZW50Q2xpZW50JywgJ3B1dCcsIG1vY2tVcGRhdGVJdGVtKVxuXG4gICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICdlbWFpbCc6ICdETy1OT1QtREVMRVRFQGNpdHlwdC5jb20nLFxuICAgIH1cblxuICAgIGNvbnN0IGxhbWJkYUV2ZW50ID0ge1xuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaXRlbSksXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBodHRwTWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gICAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgICBwYXRoUGFyYW1ldGVyczogbnVsbCxcbiAgICAgIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge1xuICAgICAgICBsaXN0SWQ6ICdMaXNzdDEyMydcbiAgICAgIH0sXG4gICAgICByZXF1ZXN0Q29udGV4dDoge1xuICAgICAgICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuICAgICAgICByZXNvdXJjZUlkOiAneW91ci1yZXNvdXJjZS1pZCcsXG4gICAgICAgIHN0YWdlOiAneW91ci1zdGFnZScsXG4gICAgICAgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG4gICAgICAgIGlkZW50aXR5OiB7XG4gICAgICAgICAgY29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuICAgICAgICAgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG4gICAgICAgICAgY29nbml0b0lkZW50aXR5SWQ6IG51bGwsXG4gICAgICAgICAgY2FsbGVyOiBudWxsLFxuICAgICAgICAgIHNvdXJjZUlwOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgICAgICBhY2Nlc3NLZXk6ICd5b3VyLWFjY2Vzcy1rZXknLFxuICAgICAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGU6IG51bGwsXG4gICAgICAgICAgY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IG51bGwsXG4gICAgICAgICAgdXNlckFybjogJ3lvdXItdXNlci1hcm4nLFxuICAgICAgICAgIHVzZXJBZ2VudDogJ3VzZXItYWdlbnQnLFxuICAgICAgICAgIHVzZXI6ICd5b3VyLXVzZXInLFxuICAgICAgICAgIGFwaUtleTogbnVsbCxcbiAgICAgICAgICBhcGlLZXlJZDogbnVsbCxcbiAgICAgICAgICBjbGllbnRDZXJ0OiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuICAgICAgICBhdXRob3JpemVyOiBudWxsLFxuICAgICAgICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcbiAgICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG4gICAgICAgIHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG4gICAgICAgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcbiAgICAgIH0sXG4gICAgICBtdWx0aVZhbHVlSGVhZGVyczoge30sXG4gICAgICBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcbiAgICAgIHN0YWdlVmFyaWFibGVzOiBudWxsLFxuICAgICAgcmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xuICAgIH1cblxuICAgIHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuICAgICAgLmV2ZW50KGxhbWJkYUV2ZW50KVxuICAgICAgLmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG4gICAgICAgIC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgLy9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLkVSUk9SKVxuICAgICAgfSlcblxuICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuICB9KVxufSlcbiJdfQ==