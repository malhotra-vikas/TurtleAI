const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

import * as Constants from '../src/utils/constants'

const myHandler = require('../src/lambda/create-contact').createContactHandler

const LambdaTester = require('lambda-tester')
import { APIGatewayProxyResult } from "aws-lambda"

const basicContactCreation_AllRequiredField_WebForm = {
  'email': 'django@gmail.com',
  'firstName': 'john',
  'lastName': 'doe',
  'phone': '14135551234',
  'tags': ['workout', 'tag2'],
  'message': 'Hi i would like to know more. Call me at XXXYTTYYY'
}

const basicContactCreation_AllRequiredField_WebForm_ExistingContact = {
  'email': 'andrew@gmail.com',
  'firstName': 'john',
  'lastName': 'doe',
  'phone': '14135551234',
  'tags': ['workout', 'tag2'],
  'message': 'Hi i would like to know more again. Call me at XXXYTTYYY'
}

const basicContactCreation_AllRequiredField = {
  'email': 'vikas@citypt.com',
  'firstName': 'john',
  'lastName': 'doe',
  'phone': '14135551234',
  'tags': ['workout', 'tag2']
}

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
}

const basicContactCreation_OnlyRequiredFields = {
  'email': '33-Testjohndoe@gmail.com',
  'firstName': 'john'
}

const basicContactCreation_MissingEmail = {
  'firstName': 'john'
}

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
}

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
}

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
}

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
}

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
}

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
}

describe('DynamoDB Put Action in Lambda', () => {
  // Initialize AWS SDK
  beforeAll(async () => {
    AWSMock.setSDKInstance(AWS)
    await deleteTestData()
  })

  // Cleanup after tests
  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Should fail with Validation error while putting an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField_WebForm_NoEmail', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)
    console.log("Running basicContactCreation_AllRequiredField_WebForm with bad Event Query Param")

    lambdaEventWebformBadParam.body = JSON.stringify(basicContactCreation_AllRequiredField_WebForm)

    return LambdaTester(myHandler)
      .event(lambdaEventWebformBadParam)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.SUCCESS)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField_WebForm', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_AllRequiredField_WebForm")
    lambdaEventWebform.body = JSON.stringify(basicContactCreation_AllRequiredField_WebForm)

    return LambdaTester(myHandler)
      .event(lambdaEventWebform)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.SUCCESS)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField_WebForm_ExistingContact', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_AllRequiredField_WebForm_ExistingContact")
    lambdaEventWebform.body = JSON.stringify(basicContactCreation_AllRequiredField_WebForm_ExistingContact)

    return LambdaTester(myHandler)
      .event(lambdaEventWebform)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.SUCCESS)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_AllRequiredField', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_AllRequiredField")
    lambdaEvent.body = JSON.stringify(basicContactCreation_AllRequiredField)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.SUCCESS)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_WellFormedAllFields', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_WellFormedAllFields")
    lambdaEvent.body = JSON.stringify(basicContactCreation_WellFormedAllFields)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.SUCCESS)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_OnlyRequiredFields', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_OnlyRequiredFields")
    lambdaEvent.body = JSON.stringify(basicContactCreation_OnlyRequiredFields)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.SUCCESS)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_MissingEmail', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_MissingEmail")
    lambdaEvent.body = JSON.stringify(basicContactCreation_MissingEmail)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.ERROR)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_InvalidEmailFormat', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_InvalidEmailFormat")
    lambdaEvent.body = JSON.stringify(basicContactCreation_InvalidEmailFormat)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.ERROR)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_InvalidPhoneFormat', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)
    console.log("Running basicContactCreation_InvalidPhoneFormat")
    lambdaEvent.body = JSON.stringify(basicContactCreation_InvalidPhoneFormat)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.ERROR)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

  it('Should put an item to DynamoDB within Lambda - basicContactCreation_DuplicateEmail', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_DuplicateEmail")
    lambdaEvent.body = JSON.stringify(basicContactCreation_DuplicateEmail)

    return LambdaTester(myHandler)
      .event(lambdaEvent)
      .expectResolve((result: APIGatewayProxyResult) => {
        //expect(addEndpointSpy).toHaveBeenCalledTimes(1)
        //expect(checkIfEmailAlreadyExistSpy).toHaveBeenCalledTimes(1)
        expect(result).toBeDefined()
        expect(result.statusCode).toBe(Constants.ERROR)
      })

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })
})

async function deleteTestData() {
  const testRecords = [
    { email: 'django@gmail.com' },
    { email: 'andrew@citypt.com' },
    { email: 'vikas@citypt.com' },
    { email: '33-Testjohndoe@gmail.com' }
    // Add other test records as needed
  ]

  testRecords.forEach(record => {
    const params = {
      TableName: Constants.CONTACTS_TABLE,
      Key: {
        "email": Constants.CONTACTS_TABLE_SORT_KEY
      },
      Region: Constants.AWS_REGION
    }

    dynamoDB.delete(params, (err: any, data: any) => {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2))
      } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2))
      }
    })
  })

}

