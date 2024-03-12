"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const myHandler = require('../src/lambda/bulk-create-contact').bulkCreateContactHandler;
const LambdaTester = require('lambda-tester');
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
// Mock S3 Event
let mockS3Event = {
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
};
describe('DynamoDB Put Action in Lambda', () => {
    // Initialize AWS SDK
    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    });
    // Cleanup after tests
    afterAll(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });
    it('Should put an item to DynamoDB within Lambda', async () => {
        const mockPutItem = jest.fn();
        AWSMock.mock('DynamoDB.DocumentClient', 'put', mockPutItem);
        console.log("Running basicContactCreation_DuplicateEmail");
        return await LambdaTester(myHandler)
            .event(mockS3Event);
        // Optionally, you can add more assertions based on your Lambda function's behavior.
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS1idWxrLWNvbnRhY3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvNS1idWxrLWNvbnRhY3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN2QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFHOUIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsd0JBQXdCLENBQUE7QUFFdkYsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBRTdDLE1BQU0sd0NBQXdDLEdBQUc7SUFDL0MsT0FBTyxFQUFFLG1CQUFtQjtJQUM1QixXQUFXLEVBQUUsTUFBTTtJQUNuQixVQUFVLEVBQUUsS0FBSztJQUNqQixPQUFPLEVBQUUsYUFBYTtJQUN0QixNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO0lBQzNCLGNBQWMsRUFBRTtRQUNkLG1CQUFtQixFQUFFLFNBQVM7UUFDOUIsYUFBYSxFQUFFLFlBQVk7UUFDM0IsVUFBVSxFQUFFLEtBQUs7S0FDbEI7SUFDRCxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO0NBQzVCLENBQUE7QUFJRCxnQkFBZ0I7QUFDaEIsSUFBSSxXQUFXLEdBQVk7SUFDekIsT0FBTyxFQUFFO1FBQ1A7WUFDRSxTQUFTLEVBQUUsV0FBVztZQUN0QixTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLFNBQVMsRUFBRSwwQkFBMEI7WUFDckMsWUFBWSxFQUFFLEtBQUs7WUFDbkIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGVBQWUsRUFBRSxXQUFXO2FBQzdCO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLFlBQVksRUFBRSxXQUFXO2dCQUN6QixrQkFBa0IsRUFBRSxpQkFBaUI7YUFDdEM7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFO29CQUNOLEdBQUcsRUFBRSxtQ0FBbUM7b0JBQ3hDLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLGFBQWEsRUFBRTt3QkFDYixXQUFXLEVBQUUsb0JBQW9CO3FCQUNsQztpQkFDRjtnQkFDRCxlQUFlLEVBQUUsZ0JBQWdCO2dCQUNqQyxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGtDQUFrQztvQkFDeEMsR0FBRyxFQUFFLG9CQUFvQjtvQkFDekIsU0FBUyxFQUFFLG9CQUFvQjtvQkFDL0IsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0QsZUFBZSxFQUFFLEtBQUs7YUFDdkI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osV0FBVyxFQUFFLGlCQUFpQjthQUMvQjtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRUQsUUFBUSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUM3QyxxQkFBcUI7SUFDckIsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFDLENBQUE7SUFFRixzQkFBc0I7SUFDdEIsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUE7UUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFFM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFBO1FBRTFELE9BQU8sTUFBTSxZQUFZLENBQUMsU0FBUyxDQUFDO2FBQ2pDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUVyQixvRkFBb0Y7SUFDdEYsQ0FBQyxDQUFDLENBQUE7QUFFSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFXU01vY2sgPSByZXF1aXJlKCdhd3Mtc2RrLW1vY2snKVxuY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5pbXBvcnQgeyBTM0V2ZW50IH0gZnJvbSAnYXdzLWxhbWJkYSdcblxuY29uc3QgbXlIYW5kbGVyID0gcmVxdWlyZSgnLi4vc3JjL2xhbWJkYS9idWxrLWNyZWF0ZS1jb250YWN0JykuYnVsa0NyZWF0ZUNvbnRhY3RIYW5kbGVyXG5cbmNvbnN0IExhbWJkYVRlc3RlciA9IHJlcXVpcmUoJ2xhbWJkYS10ZXN0ZXInKVxuXG5jb25zdCBiYXNpY0NvbnRhY3RDcmVhdGlvbl9XZWxsRm9ybWVkQWxsRmllbGRzID0ge1xuICAnZW1haWwnOiAnYW5kcmV3QGNpdHlwdC5jb20nLFxuICAnZmlyc3ROYW1lJzogJ2pvaG4nLFxuICAnbGFzdE5hbWUnOiAnZG9lJyxcbiAgJ3Bob25lJzogJzE0MTM1NTUxMjM0JyxcbiAgJ3RhZ3MnOiBbJ3dvcmtvdXQnLCAndGFnMiddLFxuICAnY3VzdG9tRmllbGRzJzoge1xuICAgICdwcmVmZXJyZWRMYW5ndWFnZSc6ICdFbmdsaXNoJyxcbiAgICAnZGF0ZU9mQmlydGgnOiAnMjAwMC0wMS0wMScsXG4gICAgJ25pY2tOYW1lJzogJ1ZpaydcbiAgfSxcbiAgJ2xpc3RzJzogWydsaXN0MScsICdsaXN0MiddXG59XG5cblxuXG4vLyBNb2NrIFMzIEV2ZW50XG5sZXQgbW9ja1MzRXZlbnQ6IFMzRXZlbnQgPSB7XG4gIFJlY29yZHM6IFtcbiAgICB7XG4gICAgICBhd3NSZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgZXZlbnROYW1lOiAnT2JqZWN0Q3JlYXRlZDpQdXQnLFxuICAgICAgZXZlbnRTb3VyY2U6ICdhd3M6czMnLFxuICAgICAgZXZlbnRUaW1lOiAnMjAyNC0wMS0yNlQxMjowMDowMC4wMDBaJyxcbiAgICAgIGV2ZW50VmVyc2lvbjogJzIuMScsXG4gICAgICByZXF1ZXN0UGFyYW1ldGVyczoge1xuICAgICAgICBzb3VyY2VJUEFkZHJlc3M6ICcxMjcuMC4wLjEnXG4gICAgICB9LFxuICAgICAgcmVzcG9uc2VFbGVtZW50czoge1xuICAgICAgICAneC1hbXotaWQtMic6ICdVbmlxdWVJRDInLFxuICAgICAgICAneC1hbXotcmVxdWVzdC1pZCc6ICdVbmlxdWVSZXF1ZXN0SUQnXG4gICAgICB9LFxuICAgICAgczM6IHtcbiAgICAgICAgYnVja2V0OiB7XG4gICAgICAgICAgYXJuOiAnYXJuOmF3czpzMzo6OmJ1bGstdXBsb2FkLWNvbnRhY3RzJyxcbiAgICAgICAgICBuYW1lOiAnYnVsay11cGxvYWQtY29udGFjdHMnLFxuICAgICAgICAgIG93bmVySWRlbnRpdHk6IHtcbiAgICAgICAgICAgIHByaW5jaXBhbElkOiAnRXhhbXBsZVByaW5jaXBhbElkJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlndXJhdGlvbklkOiAndGVzdENvbmZpZ1J1bGUnLFxuICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICBlVGFnOiAnZDQxZDhjZDk4ZjAwYjIwNGU5ODAwOTk4ZWNmODQyN2UnLFxuICAgICAgICAgIGtleTogJ3VwbG9hZENvbnRhY3RzLmNzdicsXG4gICAgICAgICAgc2VxdWVuY2VyOiAnMDA1NUFFRDZEQ0Q5MDI4MUU1JyxcbiAgICAgICAgICBzaXplOiAxMDI0XG4gICAgICAgIH0sXG4gICAgICAgIHMzU2NoZW1hVmVyc2lvbjogJzEuMCdcbiAgICAgIH0sXG4gICAgICB1c2VySWRlbnRpdHk6IHtcbiAgICAgICAgcHJpbmNpcGFsSWQ6ICdBV1M6UHJpbmNpcGFsSWQnXG4gICAgICB9XG4gICAgfVxuICBdXG59XG5cbmRlc2NyaWJlKCdEeW5hbW9EQiBQdXQgQWN0aW9uIGluIExhbWJkYScsICgpID0+IHtcbiAgLy8gSW5pdGlhbGl6ZSBBV1MgU0RLXG4gIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgQVdTTW9jay5zZXRTREtJbnN0YW5jZShBV1MpXG4gIH0pXG5cbiAgLy8gQ2xlYW51cCBhZnRlciB0ZXN0c1xuICBhZnRlckFsbCgoKSA9PiB7XG4gICAgQVdTTW9jay5yZXN0b3JlKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcpXG4gIH0pXG5cbiAgaXQoJ1Nob3VsZCBwdXQgYW4gaXRlbSB0byBEeW5hbW9EQiB3aXRoaW4gTGFtYmRhJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tQdXRJdGVtID0gamVzdC5mbigpXG4gICAgQVdTTW9jay5tb2NrKCdEeW5hbW9EQi5Eb2N1bWVudENsaWVudCcsICdwdXQnLCBtb2NrUHV0SXRlbSlcblxuICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBiYXNpY0NvbnRhY3RDcmVhdGlvbl9EdXBsaWNhdGVFbWFpbFwiKVxuXG4gICAgcmV0dXJuIGF3YWl0IExhbWJkYVRlc3RlcihteUhhbmRsZXIpXG4gICAgICAuZXZlbnQobW9ja1MzRXZlbnQpXG5cbiAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIGFkZCBtb3JlIGFzc2VydGlvbnMgYmFzZWQgb24geW91ciBMYW1iZGEgZnVuY3Rpb24ncyBiZWhhdmlvci5cbiAgfSlcblxufSlcblxuXG4iXX0=