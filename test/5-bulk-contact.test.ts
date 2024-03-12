const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
import { S3Event } from 'aws-lambda'

const myHandler = require('../src/lambda/bulk-create-contact').bulkCreateContactHandler

const LambdaTester = require('lambda-tester')

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



// Mock S3 Event
let mockS3Event: S3Event = {
  Records: [
    {
      awsRegion: 'us-east-1',
      eventName: 'ObjectCreated:Put',
      eventSource: 'aws:s3',
      eventTime: '2024-01-26T12:00:00.000Z',
      eventVersion: '2.1',
      requestParameters: {
        sourceIPAddress: '127.0.0.1'
      },
      responseElements: {
        'x-amz-id-2': 'UniqueID2',
        'x-amz-request-id': 'UniqueRequestID'
      },
      s3: {
        bucket: {
          arn: 'arn:aws:s3:::bulk-upload-contacts',
          name: 'bulk-upload-contacts',
          ownerIdentity: {
            principalId: 'ExamplePrincipalId'
          }
        },
        configurationId: 'testConfigRule',
        object: {
          eTag: 'd41d8cd98f00b204e9800998ecf8427e',
          key: 'uploadContacts.csv',
          sequencer: '0055AED6DCD90281E5',
          size: 1024
        },
        s3SchemaVersion: '1.0'
      },
      userIdentity: {
        principalId: 'AWS:PrincipalId'
      }
    }
  ]
}

describe('DynamoDB Put Action in Lambda', () => {
  // Initialize AWS SDK
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS)
  })

  // Cleanup after tests
  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Should put an item to DynamoDB within Lambda', async () => {
    const mockPutItem = jest.fn()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem)

    console.log("Running basicContactCreation_DuplicateEmail")

    return await LambdaTester(myHandler)
      .event(mockS3Event)

    // Optionally, you can add more assertions based on your Lambda function's behavior.
  })

})


