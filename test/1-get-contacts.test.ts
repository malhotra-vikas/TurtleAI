const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
import { APIGatewayProxyEvent } from 'aws-lambda'
import * as Constants from '../src/utils/constants'

// Import your AWS Lambda handler function
//import { main } from '../src/lambda/create-contact' // Replace with your actual Lambda code
const myHandler = require('../src/lambda/get-contacts').retrieveContactHandler
const LambdaTester = require('lambda-tester')
import { APIGatewayProxyResult } from "aws-lambda"

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
}

const  lambdaEvent_ValidContact = {
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
}

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
}

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
}

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
}


describe('DynamoDB Retrieve Action in Lambda', () => {
	// Initialize AWS SDK
	beforeAll(() => {
		AWSMock.setSDKInstance(AWS)
	})

	// Cleanup after tests
	afterAll(() => {
		AWSMock.restore('DynamoDB.DocumentClient')
	})

	it('Should retrieve an item with email within Lambda - lambdaEvent_ValidEmail', async () => {
		const mockFetchItem = jest.fn()
		AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem)

		return LambdaTester(myHandler)
			.event(lambdaEvent_ValidEmail)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.SUCCESS)
			})

		// Optionally, you can add more assertions based on your Lambda function's behavior.
	})

	it('Should retrieve an item with contactId within Lambda - lambdaEvent_ValidContact', async () => {
		const mockFetchItem = jest.fn()
		AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem)

		return LambdaTester(myHandler)
			.event(lambdaEvent_ValidContact)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.SUCCESS)
			})

		// Optionally, you can add more assertions based on your Lambda function's behavior.
	})

	it('Testing retrieve with non existent email within Lambda - lambdaEvent_NonExistentEmail', async () => {
		const mockFetchItem = jest.fn()
		AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem)

		return LambdaTester(myHandler)
			.event(lambdaEvent_NonExistentEmail)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.DOES_NOT_EXIST)
			})

		// Optionally, you can add more assertions based on your Lambda function's behavior.
	})

	it('Testing retrieve with non existent contactId within Lambda - lambdaEvent_NonExistentContact', async () => {
		const mockFetchItem = jest.fn()
		AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem)


		return LambdaTester(myHandler)
			.event(lambdaEvent_NonExistentContact)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.DOES_NOT_EXIST)
			})

		// Optionally, you can add more assertions based on your Lambda function's behavior.
	})

	it('Testing retrieve with email within Lambda - lambdaEvent_InValidEmail', async () => {
		const mockFetchItem = jest.fn()
		AWSMock.mock('DynamoDB.DocumentClient', 'get', mockFetchItem)


		return LambdaTester(myHandler)
			.event(lambdaEvent_InValidEmail)
			.expectResolve((result: APIGatewayProxyResult) => {
				//expect(addEndpointSpy).toHaveBeenCalledTimes(1)
				//expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
				expect(result).toBeDefined()
				expect(result.statusCode).toBe(Constants.INTERNAL_ERROR)
			})

		// Optionally, you can add more assertions based on your Lambda function's behavior.
	})
})
