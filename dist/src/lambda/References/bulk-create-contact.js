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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateContactHandler = void 0;
const aws_sdk_1 = require("aws-sdk");
const stream_1 = require("stream");
const csv_parser_1 = __importDefault(require("csv-parser"));
const uuid_1 = require("uuid");
const Constants = __importStar(require("../../utils/constants"));
const contactApi = __importStar(require("../../api/user"));
const pinpointApi = __importStar(require("../../api/pinpoint"));
const AWS = require("aws-sdk");
const s3 = new aws_sdk_1.S3();
AWS.config.update({ region: 'us-east-1' }); // Set your desired region
AWS.config.update({ region: Constants.AWS_REGION });
function processCustomFields(fields) {
    const fieldPairs = fields.split('|');
    const customFields = {};
    fieldPairs.forEach(pair => {
        const [key, value] = pair.split('=');
        customFields[key] = value;
    });
    return JSON.stringify(customFields);
}
async function bulkCreateContactHandler(event, context) {
    console.log("Received event:", JSON.stringify(event, null, 2));
    var createdContact;
    // Default to validation of email uniqueness
    let validateEmailUponContactCreation = true;
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json'
        },
        isBase64Encoded: false,
        body: ''
    };
    var bucketName = '';
    var fileKey = '';
    for (const record of event.Records) {
        bucketName = record.s3.bucket.name;
        fileKey = record.s3.object.key;
        // only one file is passed at a time to be processed
    }
    if (!bucketName || bucketName === '' || !fileKey || fileKey === '') {
        throw 'No fileKey or bucketName found in the request';
    }
    console.log("File to be processed is  ", fileKey);
    console.log("Bucket to be processed at S3 bucket  ", bucketName);
    // May be add counts of success and failing uploads later and send that back to the user
    let successfulUploads = 0;
    let failureUploads = 0;
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };
        const data = await s3.getObject(params).promise();
        let records = [];
        // Check if data.Body is not undefined
        if (data.Body) {
            const stream = stream_1.Readable.from(data.Body.toString('utf-8'));
            for await (const record of stream.pipe((0, csv_parser_1.default)())) {
                let user = {
                    email: record.email,
                    firstName: record.firstName,
                    lastName: record.lastName,
                    phone: record.phone,
                    lists: record.lists ? record.lists.split('|') : undefined,
                    tags: record.tags ? record.tags.split('|') : undefined,
                    verified: record.verified,
                    customFields: JSON.parse(processCustomFields(record.customFields)),
                    owner: record.owner,
                    message: record.message
                };
                records.push(user);
                console.log('CSV Records:', user);
            }
            for (const user of records) {
                console.log('Processing user:', user);
                if (!user.email) {
                    response.body = "Validation Error - User missing required field email";
                    console.log(response.body);
                    failureUploads = failureUploads + 1;
                    continue;
                }
                const emailValidationError = contactApi.validateEmail(user.email);
                if (emailValidationError.length > 0) {
                    response.body = emailValidationError[0];
                    console.log(response.body);
                    failureUploads = failureUploads + 1;
                    continue;
                }
                const phoneValidationError = contactApi.validatePhone(user.phone);
                if (phoneValidationError.length > 0) {
                    response.body = phoneValidationError[0];
                    console.log(response.body);
                    failureUploads = failureUploads + 1;
                    continue;
                }
                const emailExistsValidationErrors = await contactApi.validateDuplicateUser(user);
                // Validation check and send error response where the duplicate user is detected
                if (validateEmailUponContactCreation && emailExistsValidationErrors.length > 0) {
                    response.body = emailExistsValidationErrors[0];
                    console.log(response.body);
                    failureUploads = failureUploads + 1;
                    continue;
                }
                const contactId = (0, uuid_1.v4)();
                var contact = await contactApi.createContact(user, null, contactId);
                console.log("Contact Created ", JSON.stringify(contact));
                if (response.statusCode = 200) {
                    successfulUploads = successfulUploads + 1;
                    // Query for the contact that was successfully created and return that in response
                    createdContact = await contactApi.retrieveContactById(contactId);
                    console.log("createdContact  ", createdContact);
                    if (createdContact && createdContact.length > 0) {
                        console.log("createdContact ID ", createdContact[0].contactId);
                        // If the contact was successfully saved in the DB and alertAdmin is true, send a event to admin alert SnSQueue
                        // The SNS queue could come from env variable later
                        await contactApi.alertAdmin(contactId);
                        // If the contact was successfully saved in the DB and autoVerify is false, send a event to verification SnSQueue
                        await contactApi.verifyUser(contactId);
                        // If the contact was successfully saved in the DB, also add a record in ContactVerification Table
                        const contactVerificationId = (0, uuid_1.v4)();
                        contactApi.persistContactVerification(contactId, contactVerificationId);
                        // Create a Pinpoint Endpoint for this user
                        pinpointApi.createPinpointEndpoint(createdContact[0].contactId, createdContact[0].tags, createdContact[0].email);
                    }
                    // Beautify the JSON string with indentation (2 spaces)
                    const beautifiedBody = JSON.stringify(createdContact, null, 2);
                    response.body = beautifiedBody;
                }
            }
        }
        else {
            console.error('No data found in the S3 object.');
            return "No data found in the S3 object.";
        }
    }
    catch (error) {
        console.error(`Error processing file ${fileKey} from bucket ${bucketName}: ${error}`);
        throw error;
    }
    let returnStatus = "Successfully created " + successfulUploads + " contacts and validation failed on " + failureUploads + " contacts.";
    console.log(returnStatus);
    return returnStatus;
}
exports.bulkCreateContactHandler = bulkCreateContactHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsay1jcmVhdGUtY29udGFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sYW1iZGEvUmVmZXJlbmNlcy9idWxrLWNyZWF0ZS1jb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EscUNBQTRCO0FBQzVCLG1DQUFpQztBQUNqQyw0REFBNEI7QUFJNUIsK0JBQW1DO0FBQ25DLGlFQUFrRDtBQUNsRCwyREFBNEM7QUFDNUMsZ0VBQWlEO0FBRWpELCtCQUErQjtBQUMvQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsRUFBRSxDQUFBO0FBRW5CLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUEsQ0FBQywwQkFBMEI7QUFFckUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFFbkQsU0FBUyxtQkFBbUIsQ0FBQyxNQUFjO0lBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDcEMsTUFBTSxZQUFZLEdBQTJCLEVBQUUsQ0FBQTtJQUMvQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNwQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO0lBQzNCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3JDLENBQUM7QUFFTSxLQUFLLFVBQVUsd0JBQXdCLENBQUMsS0FBYyxFQUFFLE9BQWdCO0lBRTdFLE9BQU8sQ0FB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b250ZXh0IH0gZnJvbSAnYXdzLWxhbWJkYSdcbmltcG9ydCB7IFMzIH0gZnJvbSAnYXdzLXNkaydcbmltcG9ydCB7IFJlYWRhYmxlIH0gZnJvbSAnc3RyZWFtJ1xuaW1wb3J0IGNzdiBmcm9tICdjc3YtcGFyc2VyJ1xuXG5pbXBvcnQgeyBVc2VyVHlwZSB9IGZyb20gJy4uLy4uL3V0aWxzL3VzZXInXG5cbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnRzJ1xuaW1wb3J0ICogYXMgY29udGFjdEFwaSBmcm9tICcuLi8uLi9hcGkvdXNlcidcbmltcG9ydCAqIGFzIHBpbnBvaW50QXBpIGZyb20gJy4uLy4uL2FwaS9waW5wb2ludCdcblxuaW1wb3J0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKVxuY29uc3QgczMgPSBuZXcgUzMoKVxuXG5BV1MuY29uZmlnLnVwZGF0ZSh7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSkgLy8gU2V0IHlvdXIgZGVzaXJlZCByZWdpb25cblxuQVdTLmNvbmZpZy51cGRhdGUoeyByZWdpb246IENvbnN0YW50cy5BV1NfUkVHSU9OIH0pXG5cbmZ1bmN0aW9uIHByb2Nlc3NDdXN0b21GaWVsZHMoZmllbGRzOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBmaWVsZFBhaXJzID0gZmllbGRzLnNwbGl0KCd8JylcbiAgY29uc3QgY3VzdG9tRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge31cbiAgZmllbGRQYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xuICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IHBhaXIuc3BsaXQoJz0nKVxuICAgIGN1c3RvbUZpZWxkc1trZXldID0gdmFsdWVcbiAgfSlcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGN1c3RvbUZpZWxkcylcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtDcmVhdGVDb250YWN0SGFuZGxlcihldmVudDogUzNFdmVudCwgY29udGV4dDogQ29udGV4dCk6IFByb21pc2U8c3RyaW5nPiB7XG5cbiAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBldmVudDpcIiwgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDIpKVxuXG4gIHZhciBjcmVhdGVkQ29udGFjdFxuXG4gIC8vIERlZmF1bHQgdG8gdmFsaWRhdGlvbiBvZiBlbWFpbCB1bmlxdWVuZXNzXG4gIGxldCB2YWxpZGF0ZUVtYWlsVXBvbkNvbnRhY3RDcmVhdGlvbiA9IHRydWVcblxuICBsZXQgcmVzcG9uc2UgPSB7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfSxcbiAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgIGJvZHk6ICcnXG4gIH1cblxuICB2YXIgYnVja2V0TmFtZSA9ICcnXG4gIHZhciBmaWxlS2V5ID0gJydcblxuICBmb3IgKGNvbnN0IHJlY29yZCBvZiBldmVudC5SZWNvcmRzKSB7XG4gICAgYnVja2V0TmFtZSA9IHJlY29yZC5zMy5idWNrZXQubmFtZVxuICAgIGZpbGVLZXkgPSByZWNvcmQuczMub2JqZWN0LmtleVxuICAgIC8vIG9ubHkgb25lIGZpbGUgaXMgcGFzc2VkIGF0IGEgdGltZSB0byBiZSBwcm9jZXNzZWRcbiAgfVxuXG4gIGlmICghYnVja2V0TmFtZSB8fCBidWNrZXROYW1lID09PSAnJyB8fCAhZmlsZUtleSB8fCBmaWxlS2V5ID09PSAnJykge1xuICAgIHRocm93ICdObyBmaWxlS2V5IG9yIGJ1Y2tldE5hbWUgZm91bmQgaW4gdGhlIHJlcXVlc3QnXG4gIH1cblxuICBjb25zb2xlLmxvZyhcIkZpbGUgdG8gYmUgcHJvY2Vzc2VkIGlzICBcIiwgZmlsZUtleSlcbiAgY29uc29sZS5sb2coXCJCdWNrZXQgdG8gYmUgcHJvY2Vzc2VkIGF0IFMzIGJ1Y2tldCAgXCIsIGJ1Y2tldE5hbWUpXG5cbiAgLy8gTWF5IGJlIGFkZCBjb3VudHMgb2Ygc3VjY2VzcyBhbmQgZmFpbGluZyB1cGxvYWRzIGxhdGVyIGFuZCBzZW5kIHRoYXQgYmFjayB0byB0aGUgdXNlclxuICBsZXQgc3VjY2Vzc2Z1bFVwbG9hZHMgPSAwXG4gIGxldCBmYWlsdXJlVXBsb2FkcyA9IDBcblxuICB0cnkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgIEtleTogZmlsZUtleSxcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgczMuZ2V0T2JqZWN0KHBhcmFtcykucHJvbWlzZSgpXG4gICAgbGV0IHJlY29yZHM6IFVzZXJUeXBlW10gPSBbXVxuXG4gICAgLy8gQ2hlY2sgaWYgZGF0YS5Cb2R5IGlzIG5vdCB1bmRlZmluZWRcbiAgICBpZiAoZGF0YS5Cb2R5KSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBSZWFkYWJsZS5mcm9tKGRhdGEuQm9keS50b1N0cmluZygndXRmLTgnKSlcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgcmVjb3JkIG9mIHN0cmVhbS5waXBlKGNzdigpKSkge1xuXG4gICAgICAgIGxldCB1c2VyOiBVc2VyVHlwZSA9IHtcbiAgICAgICAgICBlbWFpbDogcmVjb3JkLmVtYWlsLFxuICAgICAgICAgIGZpcnN0TmFtZTogcmVjb3JkLmZpcnN0TmFtZSxcbiAgICAgICAgICBsYXN0TmFtZTogcmVjb3JkLmxhc3ROYW1lLFxuICAgICAgICAgIHBob25lOiByZWNvcmQucGhvbmUsXG4gICAgICAgICAgbGlzdHM6IHJlY29yZC5saXN0cyA/IHJlY29yZC5saXN0cy5zcGxpdCgnfCcpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHRhZ3M6IHJlY29yZC50YWdzID8gcmVjb3JkLnRhZ3Muc3BsaXQoJ3wnKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB2ZXJpZmllZDogcmVjb3JkLnZlcmlmaWVkLFxuICAgICAgICAgIGN1c3RvbUZpZWxkczogSlNPTi5wYXJzZShwcm9jZXNzQ3VzdG9tRmllbGRzKHJlY29yZC5jdXN0b21GaWVsZHMpKSxcbiAgICAgICAgICBvd25lcjogcmVjb3JkLm93bmVyLFxuICAgICAgICAgIG1lc3NhZ2U6IHJlY29yZC5tZXNzYWdlXG4gICAgICAgIH1cblxuICAgICAgICByZWNvcmRzLnB1c2godXNlcilcbiAgICAgICAgY29uc29sZS5sb2coJ0NTViBSZWNvcmRzOicsIHVzZXIpXG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgdXNlciBvZiByZWNvcmRzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQcm9jZXNzaW5nIHVzZXI6JywgdXNlcilcblxuICAgICAgICBpZiAoIXVzZXIuZW1haWwpIHtcbiAgICAgICAgICByZXNwb25zZS5ib2R5ID0gXCJWYWxpZGF0aW9uIEVycm9yIC0gVXNlciBtaXNzaW5nIHJlcXVpcmVkIGZpZWxkIGVtYWlsXCJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5ib2R5KVxuICAgICAgICAgIGZhaWx1cmVVcGxvYWRzID0gZmFpbHVyZVVwbG9hZHMgKyAxXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgZW1haWxWYWxpZGF0aW9uRXJyb3IgPSBjb250YWN0QXBpLnZhbGlkYXRlRW1haWwodXNlci5lbWFpbClcbiAgICAgICAgaWYgKGVtYWlsVmFsaWRhdGlvbkVycm9yLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXNwb25zZS5ib2R5ID0gZW1haWxWYWxpZGF0aW9uRXJyb3JbMF1cbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5ib2R5KVxuICAgICAgICAgIGZhaWx1cmVVcGxvYWRzID0gZmFpbHVyZVVwbG9hZHMgKyAxXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBob25lVmFsaWRhdGlvbkVycm9yID0gY29udGFjdEFwaS52YWxpZGF0ZVBob25lKHVzZXIucGhvbmUgYXMgc3RyaW5nKVxuICAgICAgICBpZiAocGhvbmVWYWxpZGF0aW9uRXJyb3IubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlc3BvbnNlLmJvZHkgPSBwaG9uZVZhbGlkYXRpb25FcnJvclswXVxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmJvZHkpXG4gICAgICAgICAgZmFpbHVyZVVwbG9hZHMgPSBmYWlsdXJlVXBsb2FkcyArIDFcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW1haWxFeGlzdHNWYWxpZGF0aW9uRXJyb3JzID0gYXdhaXQgY29udGFjdEFwaS52YWxpZGF0ZUR1cGxpY2F0ZVVzZXIodXNlcilcblxuICAgICAgICAvLyBWYWxpZGF0aW9uIGNoZWNrIGFuZCBzZW5kIGVycm9yIHJlc3BvbnNlIHdoZXJlIHRoZSBkdXBsaWNhdGUgdXNlciBpcyBkZXRlY3RlZFxuICAgICAgICBpZiAodmFsaWRhdGVFbWFpbFVwb25Db250YWN0Q3JlYXRpb24gJiYgZW1haWxFeGlzdHNWYWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXNwb25zZS5ib2R5ID0gZW1haWxFeGlzdHNWYWxpZGF0aW9uRXJyb3JzWzBdXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuYm9keSlcbiAgICAgICAgICBmYWlsdXJlVXBsb2FkcyA9IGZhaWx1cmVVcGxvYWRzICsgMVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb250YWN0SWQgPSB1dWlkdjQoKVxuICAgICAgICB2YXIgY29udGFjdCA9IGF3YWl0IGNvbnRhY3RBcGkuY3JlYXRlQ29udGFjdCh1c2VyLCBudWxsLCBjb250YWN0SWQpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29udGFjdCBDcmVhdGVkIFwiLCBKU09OLnN0cmluZ2lmeShjb250YWN0KSlcblxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMCkge1xuICAgICAgICAgIHN1Y2Nlc3NmdWxVcGxvYWRzID0gc3VjY2Vzc2Z1bFVwbG9hZHMgKyAxXG5cbiAgICAgICAgICAvLyBRdWVyeSBmb3IgdGhlIGNvbnRhY3QgdGhhdCB3YXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgYW5kIHJldHVybiB0aGF0IGluIHJlc3BvbnNlXG4gICAgICAgICAgY3JlYXRlZENvbnRhY3QgPSBhd2FpdCBjb250YWN0QXBpLnJldHJpZXZlQ29udGFjdEJ5SWQoY29udGFjdElkKVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlZENvbnRhY3QgIFwiLCBjcmVhdGVkQ29udGFjdClcblxuICAgICAgICAgIGlmIChjcmVhdGVkQ29udGFjdCAmJiBjcmVhdGVkQ29udGFjdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNyZWF0ZWRDb250YWN0IElEIFwiLCBjcmVhdGVkQ29udGFjdFswXS5jb250YWN0SWQpXG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBjb250YWN0IHdhcyBzdWNjZXNzZnVsbHkgc2F2ZWQgaW4gdGhlIERCIGFuZCBhbGVydEFkbWluIGlzIHRydWUsIHNlbmQgYSBldmVudCB0byBhZG1pbiBhbGVydCBTblNRdWV1ZVxuXG4gICAgICAgICAgICAvLyBUaGUgU05TIHF1ZXVlIGNvdWxkIGNvbWUgZnJvbSBlbnYgdmFyaWFibGUgbGF0ZXJcbiAgICAgICAgICAgIGF3YWl0IGNvbnRhY3RBcGkuYWxlcnRBZG1pbihjb250YWN0SWQpXG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBjb250YWN0IHdhcyBzdWNjZXNzZnVsbHkgc2F2ZWQgaW4gdGhlIERCIGFuZCBhdXRvVmVyaWZ5IGlzIGZhbHNlLCBzZW5kIGEgZXZlbnQgdG8gdmVyaWZpY2F0aW9uIFNuU1F1ZXVlXG4gICAgICAgICAgICBhd2FpdCBjb250YWN0QXBpLnZlcmlmeVVzZXIoY29udGFjdElkKVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgY29udGFjdCB3YXMgc3VjY2Vzc2Z1bGx5IHNhdmVkIGluIHRoZSBEQiwgYWxzbyBhZGQgYSByZWNvcmQgaW4gQ29udGFjdFZlcmlmaWNhdGlvbiBUYWJsZVxuICAgICAgICAgICAgY29uc3QgY29udGFjdFZlcmlmaWNhdGlvbklkID0gdXVpZHY0KClcbiAgICAgICAgICAgIGNvbnRhY3RBcGkucGVyc2lzdENvbnRhY3RWZXJpZmljYXRpb24oY29udGFjdElkLCBjb250YWN0VmVyaWZpY2F0aW9uSWQpXG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIFBpbnBvaW50IEVuZHBvaW50IGZvciB0aGlzIHVzZXJcbiAgICAgICAgICAgIHBpbnBvaW50QXBpLmNyZWF0ZVBpbnBvaW50RW5kcG9pbnQoY3JlYXRlZENvbnRhY3RbMF0uY29udGFjdElkLCBjcmVhdGVkQ29udGFjdFswXS50YWdzLCBjcmVhdGVkQ29udGFjdFswXS5lbWFpbClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBCZWF1dGlmeSB0aGUgSlNPTiBzdHJpbmcgd2l0aCBpbmRlbnRhdGlvbiAoMiBzcGFjZXMpXG4gICAgICAgICAgY29uc3QgYmVhdXRpZmllZEJvZHkgPSBKU09OLnN0cmluZ2lmeShjcmVhdGVkQ29udGFjdCwgbnVsbCwgMilcbiAgICAgICAgICByZXNwb25zZS5ib2R5ID0gYmVhdXRpZmllZEJvZHlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdObyBkYXRhIGZvdW5kIGluIHRoZSBTMyBvYmplY3QuJylcbiAgICAgIHJldHVybiBcIk5vIGRhdGEgZm91bmQgaW4gdGhlIFMzIG9iamVjdC5cIlxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBFcnJvciBwcm9jZXNzaW5nIGZpbGUgJHtmaWxlS2V5fSBmcm9tIGJ1Y2tldCAke2J1Y2tldE5hbWV9OiAke2Vycm9yfWApXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxuICBsZXQgcmV0dXJuU3RhdHVzID0gXCJTdWNjZXNzZnVsbHkgY3JlYXRlZCBcIiArIHN1Y2Nlc3NmdWxVcGxvYWRzICsgXCIgY29udGFjdHMgYW5kIHZhbGlkYXRpb24gZmFpbGVkIG9uIFwiICsgZmFpbHVyZVVwbG9hZHMgKyBcIiBjb250YWN0cy5cIlxuICBjb25zb2xlLmxvZyhyZXR1cm5TdGF0dXMpXG4gIHJldHVybiByZXR1cm5TdGF0dXNcbn1cblxuXG5cbiJdfQ==