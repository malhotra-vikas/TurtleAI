const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
import * as Constants from '../src/utils/constants'

const myHandler = require('../src/lambda/update-contact-subscriptions').updateContactSubscriptionsHandler
const LambdaTester = require('lambda-tester')
import { APIGatewayProxyResult } from "aws-lambda"

const Add_item_WithInvalidEmail = {
  'email': 'TESsT-johndoe@gmail.com',
}

const Add_item_WithNonExistentEmail = {
  'email': 'john@doegmail.com',
}

const Add_item_WithInvalidContactId = {
  'contactId': 123,
}

const Add_item_WithNonExistentContactId = {
  'email': 'jodshn@doegmail.com',
}

const Add_item_WithNoData = {
}

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
}

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
}

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

  it('Should update an item subscription with email to DynamoDB within Lambda', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

    const item = {
      'email': 'DO-NOT-DELETE@citypt.com',
    }

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
    }

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

  it('Should update an item subscription with contact id to DynamoDB within Lambda', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

    const item = {
      'contactId': 'f115df1e-f210-42b7-92d2-29063079cf02',
    }

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
    }

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


  it('Should delete an item subscription with contact id to DynamoDB within Lambda', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

    const item = {
      'contactId': 'f115df1e-f210-42b7-92d2-29063079cf02',
    }

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
    }

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

  it('Should delete an item subscription with email to DynamoDB within Lambda', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

    const item = {
      'email': 'DO-NOT-DELETE@citypt.com',
    }

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
    }

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

  it('Should try to delete an nonexistent item subscription with contact id to DynamoDB within Lambda', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

    const item = {
      'contactId': 'f115df1e-f210-42b7-92d2-29063079cf02',
    }

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
    }

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

  it('Should try to delete an nonexistent sitem subscription with email to DynamoDB within Lambda', async () => {
    const mockUpdateItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockUpdateItem)

    const item = {
      'email': 'DO-NOT-DELETE@citypt.com',
    }

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
    }

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
