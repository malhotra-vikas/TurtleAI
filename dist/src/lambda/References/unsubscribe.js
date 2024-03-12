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
exports.unSubscribeHandler = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../../utils/constants"));
const contactApi = __importStar(require("../../api/user"));
AWS.config.update({ region: Constants.AWS_REGION });
async function unSubscribeHandler(event) {
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json'
        },
        isBase64Encoded: false,
        body: ''
    };
    try {
        const eventBody = JSON.parse(JSON.stringify(event || '{}'));
        console.log("To be Updated Event Data", eventBody);
        const requestBody = JSON.parse(event.body || '{}');
        console.log("requestBody", requestBody);
        // Check if the payload has the required email field.
        if ((!requestBody.email || typeof requestBody.email !== 'string') &&
            (!requestBody.contactId || typeof requestBody.contactId !== 'string')) {
            response.body = "Invalid request format";
            response.statusCode = Constants.INTERNAL_ERROR;
            return response;
        }
        let searchKey = {
            key: '',
            type: ''
        };
        if (requestBody.email) {
            searchKey.key = requestBody.email;
            searchKey.type = "sort-key";
            const emailValidationError = contactApi.validateEmail(requestBody.email);
            if (emailValidationError.length > 0) {
                response.body = "Invalid email format";
                response.statusCode = Constants.INTERNAL_ERROR;
                return response;
            }
            const emailExistsValidationErrors = await contactApi.validateExistingUser(requestBody.email);
            // Validation check and send error response where the existing user is not detected for this email
            if (emailExistsValidationErrors.length > 0) {
                response.body = emailExistsValidationErrors[0];
                response.statusCode = Constants.ERROR;
                return response;
            }
        }
        else if (requestBody.contactId) {
            searchKey.key = requestBody.contactId;
            searchKey.type = "partition-key";
            if (typeof requestBody.contactId !== 'string') {
                response.body = "Invalid contact ID criteria";
                response.statusCode = Constants.INTERNAL_ERROR;
                return response;
            }
            const contactIdExistsValidationErrors = await contactApi.validateExistingUserByContactId(requestBody.contactId);
            // Validation check and send error response where the existing user is not detected for this email
            if (contactIdExistsValidationErrors.length > 0) {
                response.body = contactIdExistsValidationErrors[0];
                response.statusCode = Constants.ERROR;
                return response;
            }
        }
        const httpMethod = event.httpMethod;
        let updateResponse;
        if (httpMethod === Constants.POST) {
            updateResponse = await contactApi.unsubscribeContactFromAllLists(searchKey);
            console.log("Contact updated ", updateResponse);
            response.body = updateResponse.body;
            response.statusCode = updateResponse.statusCode;
        }
        else {
            response.body = "Invalid request";
            response.statusCode = Constants.INTERNAL_ERROR;
            return response;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            response.body = error.message;
            response.statusCode = Constants.ERROR;
        }
    }
    console.log("Response from update Lambda ", JSON.stringify(response));
    return response;
}
exports.unSubscribeHandler = unSubscribeHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5zdWJzY3JpYmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGFtYmRhL1JlZmVyZW5jZXMvdW5zdWJzY3JpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFL0IsaUVBQWtEO0FBQ2xELDJEQUE0QztBQUU1QyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtBQUU1QyxLQUFLLFVBQVUsa0JBQWtCLENBQUMsS0FBMkI7SUFFbEUsSUFBSSxRQUFRLEdBQUc7UUFDYixVQUFVLEVBQUUsR0FBRztRQUNmLE9BQU8sRUFBRTtZQUNQLDZCQUE2QixFQUFFLEdBQUc7WUFDbEMsY0FBYyxFQUFFLGtCQUFrQjtTQUNuQztRQUNELGVBQWUsRUFBRSxLQUFLO1FBQ3RCLElBQUksRUFBRSxFQUFFO0tBQ1QsQ0FBQTtJQUVELElBQUk7UUFFRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUVsRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUE7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFFdkMscURBQXFEO1FBQ3JELElBQ0UsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksT0FBTyxXQUFXLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQztZQUM3RCxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsSUFBSSxPQUFPLFdBQVcsQ0FBQyxTQUFT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S0FBSyxZQUFZLEtBQUssRUFBRTtZQUMxQixRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUE7WUFDN0IsUUFBUSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFBO1NBQ3RDO0tBQ0Y7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUNyRSxPQUFPLFFBQVEsQ0FBQTtBQUVqQixDQUFDO0FBakdELGdEQWlHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJylcbmltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50LCBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tICdhd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4uLy4uL3V0aWxzL2NvbnN0YW50cydcbmltcG9ydCAqIGFzIGNvbnRhY3RBcGkgZnJvbSAnLi4vLi4vYXBpL3VzZXInXG5cbkFXUy5jb25maWcudXBkYXRlKHsgcmVnaW9uOiBDb25zdGFudHMuQVdTX1JFR0lPTiB9KVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5TdWJzY3JpYmVIYW5kbGVyKGV2ZW50OiBBUElHYXRld2F5UHJveHlFdmVudCk6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0PiB7XG5cbiAgbGV0IHJlc3BvbnNlID0ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICBib2R5OiAnJ1xuICB9XG5cbiAgdHJ5IHtcblxuICAgIGNvbnN0IGV2ZW50Qm9keSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZXZlbnQgfHwgJ3t9JykpXG4gICAgY29uc29sZS5sb2coXCJUbyBiZSBVcGRhdGVkIEV2ZW50IERhdGFcIiwgZXZlbnRCb2R5KVxuXG4gICAgY29uc3QgcmVxdWVzdEJvZHkgPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkgfHwgJ3t9JylcbiAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RCb2R5XCIsIHJlcXVlc3RCb2R5KVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBheWxvYWQgaGFzIHRoZSByZXF1aXJlZCBlbWFpbCBmaWVsZC5cbiAgICBpZiAoXG4gICAgICAoIXJlcXVlc3RCb2R5LmVtYWlsIHx8IHR5cGVvZiByZXF1ZXN0Qm9keS5lbWFpbCAhPT0gJ3N0cmluZycpICYmXG4gICAgICAoIXJlcXVlc3RCb2R5LmNvbnRhY3RJZCB8fCB0eXBlb2YgcmVxdWVzdEJvZHkuY29udGFjdElkICE9PSAnc3RyaW5nJylcbiAgICApIHtcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSBcIkludmFsaWQgcmVxdWVzdCBmb3JtYXRcIlxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUlxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuICAgIGxldCBzZWFyY2hLZXkgPSB7XG4gICAgICBrZXk6ICcnLFxuICAgICAgdHlwZTogJydcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdEJvZHkuZW1haWwpIHtcbiAgICAgIHNlYXJjaEtleS5rZXkgPSByZXF1ZXN0Qm9keS5lbWFpbFxuICAgICAgc2VhcmNoS2V5LnR5cGUgPSBcInNvcnQta2V5XCJcblxuICAgICAgY29uc3QgZW1haWxWYWxpZGF0aW9uRXJyb3IgPSBjb250YWN0QXBpLnZhbGlkYXRlRW1haWwocmVxdWVzdEJvZHkuZW1haWwpXG4gICAgICBpZiAoZW1haWxWYWxpZGF0aW9uRXJyb3IubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwb25zZS5ib2R5ID0gXCJJbnZhbGlkIGVtYWlsIGZvcm1hdFwiXG4gICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSBDb25zdGFudHMuSU5URVJOQUxfRVJST1JcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVtYWlsRXhpc3RzVmFsaWRhdGlvbkVycm9ycyA9IGF3YWl0IGNvbnRhY3RBcGkudmFsaWRhdGVFeGlzdGluZ1VzZXIocmVxdWVzdEJvZHkuZW1haWwpXG5cbiAgICAgIC8vIFZhbGlkYXRpb24gY2hlY2sgYW5kIHNlbmQgZXJyb3IgcmVzcG9uc2Ugd2hlcmUgdGhlIGV4aXN0aW5nIHVzZXIgaXMgbm90IGRldGVjdGVkIGZvciB0aGlzIGVtYWlsXG4gICAgICBpZiAoZW1haWxFeGlzdHNWYWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzcG9uc2UuYm9keSA9IGVtYWlsRXhpc3RzVmFsaWRhdGlvbkVycm9yc1swXVxuICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLkVSUk9SXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0Qm9keS5jb250YWN0SWQpIHtcbiAgICAgIHNlYXJjaEtleS5rZXkgPSByZXF1ZXN0Qm9keS5jb250YWN0SWRcbiAgICAgIHNlYXJjaEtleS50eXBlID0gXCJwYXJ0aXRpb24ta2V5XCJcblxuICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0Qm9keS5jb250YWN0SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlc3BvbnNlLmJvZHkgPSBcIkludmFsaWQgY29udGFjdCBJRCBjcml0ZXJpYVwiXG4gICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSBDb25zdGFudHMuSU5URVJOQUxfRVJST1JcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRhY3RJZEV4aXN0c1ZhbGlkYXRpb25FcnJvcnMgPSBhd2FpdCBjb250YWN0QXBpLnZhbGlkYXRlRXhpc3RpbmdVc2VyQnlDb250YWN0SWQocmVxdWVzdEJvZHkuY29udGFjdElkKVxuXG4gICAgICAvLyBWYWxpZGF0aW9uIGNoZWNrIGFuZCBzZW5kIGVycm9yIHJlc3BvbnNlIHdoZXJlIHRoZSBleGlzdGluZyB1c2VyIGlzIG5vdCBkZXRlY3RlZCBmb3IgdGhpcyBlbWFpbFxuICAgICAgaWYgKGNvbnRhY3RJZEV4aXN0c1ZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwb25zZS5ib2R5ID0gY29udGFjdElkRXhpc3RzVmFsaWRhdGlvbkVycm9yc1swXVxuICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLkVSUk9SXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGh0dHBNZXRob2QgPSBldmVudC5odHRwTWV0aG9kXG4gICAgbGV0IHVwZGF0ZVJlc3BvbnNlXG4gICAgaWYgKGh0dHBNZXRob2QgPT09IENvbnN0YW50cy5QT1NUKSB7XG4gICAgICB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IGNvbnRhY3RBcGkudW5zdWJzY3JpYmVDb250YWN0RnJvbUFsbExpc3RzKHNlYXJjaEtleSlcbiAgICAgIGNvbnNvbGUubG9nKFwiQ29udGFjdCB1cGRhdGVkIFwiLCB1cGRhdGVSZXNwb25zZSlcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSB1cGRhdGVSZXNwb25zZS5ib2R5XG4gICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gdXBkYXRlUmVzcG9uc2Uuc3RhdHVzQ29kZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZS5ib2R5ID0gXCJJbnZhbGlkIHJlcXVlc3RcIlxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUlxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSBlcnJvci5tZXNzYWdlXG4gICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLkVSUk9SXG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIHVwZGF0ZSBMYW1iZGEgXCIsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSlcbiAgcmV0dXJuIHJlc3BvbnNlXG5cbn0iXX0=