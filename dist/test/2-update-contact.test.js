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
const myHandler = require('../src/lambda/update-contact').updateContactHandler;
const LambdaTester = require('lambda-tester');
const lambdaEvent_WithValidContactId = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
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
const lambdaEvent_WithNonExistentContactId = {
    body: '',
    headers: {
        'Content-Type': 'application/json'
    },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/your-resource-path',
    queryStringParameters: {
        contactId: 'be46jk88367c'
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
const item_WithValidUpdateInputs = {
    'firstName': 'marco',
    'lastName': 'doe',
    'phone': '14235551234',
    'tags': ['tag1', 'tag2'],
    'customFields': {
        'preferredLanguage': 'spanish',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2'],
    'owner': 'updated owner'
};
const item_WithValidPartialInputs = {
    'firstName': 'marco',
    'lastName': 'polo'
};
const item_WithBadEmail = {
    'firstName': 'Joey',
    'lastName': 'doe',
    'phone': '+14235551234',
    'tags': ['tag1', 'tag2'],
    'customFields': {
        'preferredLanguage': 'Italian',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2'],
    'owner': 'updated owner'
};
const item_WithBadPhone = {
    'firstName': 'Hinna',
    'lastName': 'doe',
    'phone': '423sc3184527',
    'tags': ['tag1', 'tag2'],
    'customFields': {
        'preferredLanguage': 'Turkish',
        'dateOfBirth': '2000-01-01',
        'nickName': 'Vik'
    },
    'lists': ['list1', 'list2'],
    'owner': 'updated owner'
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
    it('Should update an item to DynamoDB within Lambda - lambdaEvent_WithValidContactId', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithValidUpdateInputs);
        return LambdaTester(myHandler)
            .event(lambdaEvent_WithValidContactId)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should update an item to DynamoDB within Lambda - item_WithValidPartialInputs', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithValidPartialInputs);
        return LambdaTester(myHandler)
            .event(lambdaEvent_WithValidContactId)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.SUCCESS);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    /*
    it('Should update an item to DynamoDB within Lambda - item_WithBadEmail', async () => {
      const mockUpdateItem = jest.fn()
      AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)
  
      lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithBadEmail)
      
      return LambdaTester(myHandler)
              .event(lambdaEvent_WithValidContactId)
              .expectResolve((result: APIGatewayProxyResult) => {
                  //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
                  //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
                  expect(result).toBeDefined()
                  expect(result.statusCode).toBe(Constants.INTERNAL_ERROR)
              })
  
    })
  */
    it('Should update an item to DynamoDB within Lambda - item_WithValidUpdateInputs', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithBadPhone);
        return LambdaTester(myHandler)
            .event(lambdaEvent_WithValidContactId)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.INTERNAL_ERROR);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
    it('Should update an item to DynamoDB within Lambda - Non Existing contact with item_WithValidUpdateInputs', async () => {
        const mockUpdateItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem);
        lambdaEvent_WithNonExistentContactId.body = JSON.stringify(item_WithValidUpdateInputs);
        return LambdaTester(myHandler)
            .event(lambdaEvent_WithNonExistentContactId)
            .expectResolve((result) => {
            //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
            //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
            expect(result).toBeDefined();
            expect(result.statusCode).toBe(Constants.DOES_NOT_EXIST);
        });
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi11cGRhdGUtY29udGFjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC8yLXVwZGF0ZS1jb250YWN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN2QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFOUIsa0VBQW1EO0FBR25ELDBDQUEwQztBQUMxQyw2RkFBNkY7QUFDN0YsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsb0JBQW9CLENBQUE7QUFDOUUsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBRzdDLE1BQU0sOEJBQThCLEdBQUc7SUFDdEMsSUFBSSxFQUFFLEVBQUU7SUFDUixPQUFPLEVBQUU7UUFDUCxjQUFjLEVBQUUsa0JBQWtCO0tBQ25DO0lBQ0QsVUFBVSxFQUFFLE1BQU07SUFDbEIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsSUFBSSxFQUFFLHFCQUFxQjtJQUMzQixxQkFBcUIsRUFBRTtRQUN0QixTQUFTLEVBQUUsc0NBQXNDO0tBQ2pEO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLEtBQUssRUFBRSxZQUFZO1FBQ25CLFNBQVMsRUFBRSxpQkFBaUI7UUFDNUIsUUFBUSxFQUFFO1lBQ1gscUJBQXFCLEVBQUUsSUFBSTtZQUMzQixTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsTUFBTSxFQUFFLElBQUk7WUFDWixRQUFRLEVBQUUsV0FBVztZQUNyQixjQUFjLEVBQUUsSUFBSTtZQUNwQixTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLHlCQUF5QixFQUFFLElBQUk7WUFDL0IsNkJB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QUFDLENBQUE7UUFFRCxvRkFBb0Y7SUFDdEYsQ0FBQyxDQUFDLENBQUE7QUFFSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFXU01vY2sgPSByZXF1aXJlKCdhd3Mtc2RrLW1vY2snKVxuY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlFdmVudCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vc3JjL3V0aWxzL2NvbnN0YW50cydcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnXG5cbi8vIEltcG9ydCB5b3VyIEFXUyBMYW1iZGEgaGFuZGxlciBmdW5jdGlvblxuLy9pbXBvcnQgeyBtYWluIH0gZnJvbSAnLi4vc3JjL2xhbWJkYS9jcmVhdGUtY29udGFjdCcgLy8gUmVwbGFjZSB3aXRoIHlvdXIgYWN0dWFsIExhbWJkYSBjb2RlXG5jb25zdCBteUhhbmRsZXIgPSByZXF1aXJlKCcuLi9zcmMvbGFtYmRhL3VwZGF0ZS1jb250YWN0JykudXBkYXRlQ29udGFjdEhhbmRsZXJcbmNvbnN0IExhbWJkYVRlc3RlciA9IHJlcXVpcmUoJ2xhbWJkYS10ZXN0ZXInKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSBcImF3cy1sYW1iZGFcIlxuXG5jb25zdCBsYW1iZGFFdmVudF9XaXRoVmFsaWRDb250YWN0SWQgPSB7XG5cdGJvZHk6ICcnLFxuXHRoZWFkZXJzOiB7XG5cdCAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHR9LFxuXHRodHRwTWV0aG9kOiAnUE9TVCcsXG5cdGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG5cdHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcblx0cXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7XG5cdFx0Y29udGFjdElkOiAnZjExNWRmMWUtZjIxMC00MmI3LTkyZDItMjkwNjMwNzljZjAyJ1xuXHR9LFxuXHRyZXF1ZXN0Q29udGV4dDoge1xuXHQgIGFjY291bnRJZDogJ3lvdXItYWNjb3VudC1pZCcsXG5cdCAgcmVzb3VyY2VJZDogJ3lvdXItcmVzb3VyY2UtaWQnLFxuXHQgIHN0YWdlOiAneW91ci1zdGFnZScsXG5cdCAgcmVxdWVzdElkOiAneW91ci1yZXF1ZXN0LWlkJyxcblx0ICBpZGVudGl0eToge1xuXHRcdGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcblx0XHRhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuXHRcdGNvZ25pdG9JZGVudGl0eUlkOiBudWxsLFxuXHRcdGNhbGxlcjogbnVsbCxcblx0XHRzb3VyY2VJcDogJzEyNy4wLjAuMScsXG5cdFx0cHJpbmNpcGFsT3JnSWQ6IG51bGwsXG5cdFx0YWNjZXNzS2V5OiAneW91ci1hY2Nlc3Mta2V5Jyxcblx0XHRjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuXHRcdGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiBudWxsLFxuXHRcdHVzZXJBcm46ICd5b3VyLXVzZXItYXJuJyxcblx0XHR1c2VyQWdlbnQ6ICd1c2VyLWFnZW50Jyxcblx0XHR1c2VyOiAneW91ci11c2VyJyxcblx0XHRhcGlLZXk6IG51bGwsXG5cdFx0YXBpS2V5SWQ6IG51bGwsXG5cdFx0Y2xpZW50Q2VydDogbnVsbFxuXHQgIH0sXG5cdCAgYXBpSWQ6ICd5b3VyLWFwaS1pZCcsXG5cdCAgYXV0aG9yaXplcjogbnVsbCxcblx0ICBwcm90b2NvbDogJ0hUVFAvMS4xJyxcblx0ICBodHRwTWV0aG9kOiAnUE9TVCcsXG5cdCAgcGF0aDogJy95b3VyLXJlc291cmNlLXBhdGgnLFxuXHQgIHJlcXVlc3RUaW1lRXBvY2g6IDE2NzkyNTExOTgwMDAsXG5cdCAgcmVzb3VyY2VQYXRoOiAnL3twcm94eSt9J1xuXHR9LFxuXHRtdWx0aVZhbHVlSGVhZGVyczoge30sXG5cdG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHt9LFxuXHRzdGFnZVZhcmlhYmxlczogbnVsbCxcblx0cmVzb3VyY2U6ICd5b3VyLXJlc291cmNlJ1xuICB9XG5cbiAgY29uc3QgbGFtYmRhRXZlbnRfV2l0aE5vbkV4aXN0ZW50Q29udGFjdElkID0ge1xuXHRib2R5OiAnJyxcblx0aGVhZGVyczoge1xuXHQgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0fSxcblx0aHR0cE1ldGhvZDogJ1BPU1QnLFxuXHRpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuXHRwYXRoOiAnL3lvdXItcmVzb3VyY2UtcGF0aCcsXG5cdHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge1xuXHRcdGNvbnRhY3RJZDogJ2JlNDZqazg4MzY3Yydcblx0fSxcblx0cmVxdWVzdENvbnRleHQ6IHtcblx0ICBhY2NvdW50SWQ6ICd5b3VyLWFjY291bnQtaWQnLFxuXHQgIHJlc291cmNlSWQ6ICd5b3VyLXJlc291cmNlLWlkJyxcblx0ICBzdGFnZTogJ3lvdXItc3RhZ2UnLFxuXHQgIHJlcXVlc3RJZDogJ3lvdXItcmVxdWVzdC1pZCcsXG5cdCAgaWRlbnRpdHk6IHtcblx0XHRjb2duaXRvSWRlbnRpdHlQb29sSWQ6IG51bGwsXG5cdFx0YWNjb3VudElkOiAneW91ci1hY2NvdW50LWlkJyxcblx0XHRjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcblx0XHRjYWxsZXI6IG51bGwsXG5cdFx0c291cmNlSXA6ICcxMjcuMC4wLjEnLFxuXHRcdHByaW5jaXBhbE9yZ0lkOiBudWxsLFxuXHRcdGFjY2Vzc0tleTogJ3lvdXItYWNjZXNzLWtleScsXG5cdFx0Y29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZTogbnVsbCxcblx0XHRjb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcjogbnVsbCxcblx0XHR1c2VyQXJuOiAneW91ci11c2VyLWFybicsXG5cdFx0dXNlckFnZW50OiAndXNlci1hZ2VudCcsXG5cdFx0dXNlcjogJ3lvdXItdXNlcicsXG5cdFx0YXBpS2V5OiBudWxsLFxuXHRcdGFwaUtleUlkOiBudWxsLFxuXHRcdGNsaWVudENlcnQ6IG51bGxcblx0ICB9LFxuXHQgIGFwaUlkOiAneW91ci1hcGktaWQnLFxuXHQgIGF1dGhvcml6ZXI6IG51bGwsXG5cdCAgcHJvdG9jb2w6ICdIVFRQLzEuMScsXG5cdCAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuXHQgIHBhdGg6ICcveW91ci1yZXNvdXJjZS1wYXRoJyxcblx0ICByZXF1ZXN0VGltZUVwb2NoOiAxNjc5MjUxMTk4MDAwLFxuXHQgIHJlc291cmNlUGF0aDogJy97cHJveHkrfSdcblx0fSxcblx0bXVsdGlWYWx1ZUhlYWRlcnM6IHt9LFxuXHRtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB7fSxcblx0c3RhZ2VWYXJpYWJsZXM6IG51bGwsXG5cdHJlc291cmNlOiAneW91ci1yZXNvdXJjZSdcbiAgfVxuXG4gIGNvbnN0IGl0ZW1fV2l0aFZhbGlkVXBkYXRlSW5wdXRzID0ge1xuXHQnZmlyc3ROYW1lJzogJ21hcmNvJyxcblx0J2xhc3ROYW1lJzogJ2RvZScsXG5cdCdwaG9uZSc6ICcxNDIzNTU1MTIzNCcsXG5cdCd0YWdzJzogWyd0YWcxJywgJ3RhZzInXSxcblx0J2N1c3RvbUZpZWxkcyc6IHtcblx0XHQncHJlZmVycmVkTGFuZ3VhZ2UnOiAnc3BhbmlzaCcsXG5cdFx0J2RhdGVPZkJpcnRoJzogJzIwMDAtMDEtMDEnLFxuXHRcdCduaWNrTmFtZSc6ICdWaWsnXG5cdH0sXG5cdCdsaXN0cyc6IFsnbGlzdDEnLCAnbGlzdDInXSxcblx0J293bmVyJzogJ3VwZGF0ZWQgb3duZXInXG4gIH1cblxuICBjb25zdCBpdGVtX1dpdGhWYWxpZFBhcnRpYWxJbnB1dHMgPSB7XG5cdCdmaXJzdE5hbWUnOiAnbWFyY28nLFxuXHQnbGFzdE5hbWUnOiAncG9sbydcbiAgfVxuXG4gIGNvbnN0IGl0ZW1fV2l0aEJhZEVtYWlsID0ge1xuXHQnZmlyc3ROYW1lJzogJ0pvZXknLFxuXHQnbGFzdE5hbWUnOiAnZG9lJyxcblx0J3Bob25lJzogJysxNDIzNTU1MTIzNCcsXG5cdCd0YWdzJzogWyd0YWcxJywgJ3RhZzInXSxcblx0J2N1c3RvbUZpZWxkcyc6IHtcblx0XHQncHJlZmVycmVkTGFuZ3VhZ2UnOiAnSXRhbGlhbicsXG5cdFx0J2RhdGVPZkJpcnRoJzogJzIwMDAtMDEtMDEnLFxuXHRcdCduaWNrTmFtZSc6ICdWaWsnXG5cdH0sXG5cdCdsaXN0cyc6IFsnbGlzdDEnLCAnbGlzdDInXSxcblx0J293bmVyJzogJ3VwZGF0ZWQgb3duZXInXG4gIH1cblxuICBjb25zdCBpdGVtX1dpdGhCYWRQaG9uZSA9IHtcblx0J2ZpcnN0TmFtZSc6ICdIaW5uYScsXG5cdCdsYXN0TmFtZSc6ICdkb2UnLFxuXHQncGhvbmUnOiAnNDIzc2MzMTg0NTI3Jyxcblx0J3RhZ3MnOiBbJ3RhZzEnLCAndGFnMiddLFxuXHQnY3VzdG9tRmllbGRzJzoge1xuXHRcdCdwcmVmZXJyZWRMYW5ndWFnZSc6ICdUdXJraXNoJyxcblx0XHQnZGF0ZU9mQmlydGgnOiAnMjAwMC0wMS0wMScsXG5cdFx0J25pY2tOYW1lJzogJ1Zpaydcblx0fSxcblx0J2xpc3RzJzogWydsaXN0MScsICdsaXN0MiddLFxuXHQnb3duZXInOiAndXBkYXRlZCBvd25lcidcbiAgfVxuXG5kZXNjcmliZSgnRHluYW1vREIgVXBkYXRlIEFjdGlvbiBpbiBMYW1iZGEnLCAoKSA9PiB7XG4gIC8vIEluaXRpYWxpemUgQVdTIFNES1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIEFXU01vY2suc2V0U0RLSW5zdGFuY2UoQVdTKVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgdGVzdHNcbiAgYWZ0ZXJBbGwoKCkgPT4ge1xuICAgIEFXU01vY2sucmVzdG9yZSgnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnKVxuICB9KVxuXG4gIGl0KCdTaG91bGQgdXBkYXRlIGFuIGl0ZW0gdG8gRHluYW1vREIgd2l0aGluIExhbWJkYSAtIGxhbWJkYUV2ZW50X1dpdGhWYWxpZENvbnRhY3RJZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtb2NrVXBkYXRlSXRlbSA9IGplc3QuZm4oKVxuICAgIEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAncHV0JywgbW9ja1VwZGF0ZUl0ZW0pXG5cblx0bGFtYmRhRXZlbnRfV2l0aFZhbGlkQ29udGFjdElkLmJvZHkgPSBKU09OLnN0cmluZ2lmeShpdGVtX1dpdGhWYWxpZFVwZGF0ZUlucHV0cylcblx0XG5cdHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuXHRcdFx0LmV2ZW50KGxhbWJkYUV2ZW50X1dpdGhWYWxpZENvbnRhY3RJZClcblx0XHRcdC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuXHRcdFx0XHQvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5TVUNDRVNTKVxuXHRcdFx0fSlcblxuICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuICB9KVxuXG4gIGl0KCdTaG91bGQgdXBkYXRlIGFuIGl0ZW0gdG8gRHluYW1vREIgd2l0aGluIExhbWJkYSAtIGl0ZW1fV2l0aFZhbGlkUGFydGlhbElucHV0cycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtb2NrVXBkYXRlSXRlbSA9IGplc3QuZm4oKVxuICAgIEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAncHV0JywgbW9ja1VwZGF0ZUl0ZW0pXG5cblx0bGFtYmRhRXZlbnRfV2l0aFZhbGlkQ29udGFjdElkLmJvZHkgPSBKU09OLnN0cmluZ2lmeShpdGVtX1dpdGhWYWxpZFBhcnRpYWxJbnB1dHMpXG5cdFxuXHRyZXR1cm4gTGFtYmRhVGVzdGVyKG15SGFuZGxlcilcblx0XHRcdC5ldmVudChsYW1iZGFFdmVudF9XaXRoVmFsaWRDb250YWN0SWQpXG5cdFx0XHQuZXhwZWN0UmVzb2x2ZSgocmVzdWx0OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHtcblx0XHRcdFx0Ly9leHBlY3QoYWRkRW5kcG9pbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXHRcdFx0XHQvL2V4cGVjdChjaGVja0lmRW1haWxBbHJlYWR5RXhpc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXHRcdFx0XHRleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG5cdFx0XHRcdGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZShDb25zdGFudHMuU1VDQ0VTUylcblx0XHRcdH0pXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcblxuICAvKlxuICBpdCgnU2hvdWxkIHVwZGF0ZSBhbiBpdGVtIHRvIER5bmFtb0RCIHdpdGhpbiBMYW1iZGEgLSBpdGVtX1dpdGhCYWRFbWFpbCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtb2NrVXBkYXRlSXRlbSA9IGplc3QuZm4oKVxuICAgIEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAncHV0JywgbW9ja1VwZGF0ZUl0ZW0pXG5cblx0bGFtYmRhRXZlbnRfV2l0aFZhbGlkQ29udGFjdElkLmJvZHkgPSBKU09OLnN0cmluZ2lmeShpdGVtX1dpdGhCYWRFbWFpbClcblx0XG5cdHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuXHRcdFx0LmV2ZW50KGxhbWJkYUV2ZW50X1dpdGhWYWxpZENvbnRhY3RJZClcblx0XHRcdC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuXHRcdFx0XHQvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUilcblx0XHRcdH0pXG5cbiAgfSlcbiovXG4gIGl0KCdTaG91bGQgdXBkYXRlIGFuIGl0ZW0gdG8gRHluYW1vREIgd2l0aGluIExhbWJkYSAtIGl0ZW1fV2l0aFZhbGlkVXBkYXRlSW5wdXRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tVcGRhdGVJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrVXBkYXRlSXRlbSlcblxuXHRsYW1iZGFFdmVudF9XaXRoVmFsaWRDb250YWN0SWQuYm9keSA9IEpTT04uc3RyaW5naWZ5KGl0ZW1fV2l0aEJhZFBob25lKVxuXHRcblx0cmV0dXJuIExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG5cdFx0XHQuZXZlbnQobGFtYmRhRXZlbnRfV2l0aFZhbGlkQ29udGFjdElkKVxuXHRcdFx0LmV4cGVjdFJlc29sdmUoKHJlc3VsdDogQVBJR2F0ZXdheVByb3h5UmVzdWx0KSA9PiB7XG5cdFx0XHRcdC8vZXhwZWN0KGFkZEVuZHBvaW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0Ly9leHBlY3QoY2hlY2tJZkVtYWlsQWxyZWFkeUV4aXN0U3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXHRcdFx0XHRleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoQ29uc3RhbnRzLklOVEVSTkFMX0VSUk9SKVxuXHRcdFx0fSlcblxuICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gYWRkIG1vcmUgYXNzZXJ0aW9ucyBiYXNlZCBvbiB5b3VyIExhbWJkYSBmdW5jdGlvbidzIGJlaGF2aW9yLlxuICB9KVxuICBcbiAgaXQoJ1Nob3VsZCB1cGRhdGUgYW4gaXRlbSB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhIC0gTm9uIEV4aXN0aW5nIGNvbnRhY3Qgd2l0aCBpdGVtX1dpdGhWYWxpZFVwZGF0ZUlucHV0cycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtb2NrVXBkYXRlSXRlbSA9IGplc3QuZm4oKVxuICAgIEFXU01vY2subW9jaygnRHluYW1vREIuRG9jdW1lbnRDbGllbnQnLCAncHV0JywgbW9ja1VwZGF0ZUl0ZW0pXG5cblx0bGFtYmRhRXZlbnRfV2l0aE5vbkV4aXN0ZW50Q29udGFjdElkLmJvZHkgPSBKU09OLnN0cmluZ2lmeShpdGVtX1dpdGhWYWxpZFVwZGF0ZUlucHV0cylcblx0XG5cdHJldHVybiBMYW1iZGFUZXN0ZXIobXlIYW5kbGVyKVxuXHRcdFx0LmV2ZW50KGxhbWJkYUV2ZW50X1dpdGhOb25FeGlzdGVudENvbnRhY3RJZClcblx0XHRcdC5leHBlY3RSZXNvbHZlKChyZXN1bHQ6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4ge1xuXHRcdFx0XHQvL2V4cGVjdChhZGRFbmRwb2ludFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdC8vZXhwZWN0KGNoZWNrSWZFbWFpbEFscmVhZHlFeGlzdFNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cdFx0XHRcdGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblx0XHRcdFx0ZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKENvbnN0YW50cy5ET0VTX05PVF9FWElTVClcblx0XHRcdH0pXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcbiAgXG59KVxuIl19