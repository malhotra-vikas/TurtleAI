const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
import { APIGatewayProxyEvent } from 'aws-lambda'
import * as Constants from '../src/utils/constants'
import { v4 as uuidv4 } from 'uuid'

// Import your AWS Lambda handler function
//import { main } from '../src/lambda/create-contact' // Replace with your actual Lambda code
const myHandler = require('../src/lambda/update-contact').updateContactHandler
const LambdaTester = require('lambda-tester')
import { APIGatewayProxyResult } from "aws-lambda"

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
  }

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
  }

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
  }

  const item_WithValidPartialInputs = {
	'firstName': 'marco',
	'lastName': 'polo'
  }

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
  }

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
  }

describe('DynamoDB Update Action in Lambda', () => {
  // Initialize AWS SDK
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS)
  })

  // Cleanup after tests
  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Should update an item to DynamoDB within Lambda - lambdaEvent_WithValidContactId', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

	lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithValidUpdateInputs)
	
	return LambdaTester(myHandler)
			.event(lambdaEvent_WithValidContactId)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.SUCCESS)
			})

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should update an item to DynamoDB within Lambda - item_WithValidPartialInputs', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

	lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithValidPartialInputs)
	
	return LambdaTester(myHandler)
			.event(lambdaEvent_WithValidContactId)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.SUCCESS)
			})

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

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
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

	lambdaEvent_WithValidContactId.body = JSON.stringify(item_WithBadPhone)
	
	return LambdaTester(myHandler)
			.event(lambdaEvent_WithValidContactId)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.INTERNAL_ERROR)
			})

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })
  
  it('Should update an item to DynamoDB within Lambda - Non Existing contact with item_WithValidUpdateInputs', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

	lambdaEvent_WithNonExistentContactId.body = JSON.stringify(item_WithValidUpdateInputs)
	
	return LambdaTester(myHandler)
			.event(lambdaEvent_WithNonExistentContactId)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.DOES_NOT_EXIST)
			})

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })
  
})
