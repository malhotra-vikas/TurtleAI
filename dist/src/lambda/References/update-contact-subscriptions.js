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
exports.updateContactSubscriptionsHandler = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../../utils/constants"));
const contactApi = __importStar(require("../../api/user"));
AWS.config.update({ region: Constants.AWS_REGION });
async function updateContactSubscriptionsHandler(event) {
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
        console.log("To be updated event data ", eventBody);
        // Extract listId from the path parameters.
        const listId = event.queryStringParameters?.listId;
        console.log("listId", listId);
        // Check if the listId is valid (you can implement your validation logic).
        if (!listId || typeof listId !== 'string') {
            response.body = "Invalid listId format";
            response.statusCode = Constants.INTERNAL_ERROR;
            return response;
        }
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
        }
        else if (requestBody.contactId) {
            searchKey.key = requestBody.contactId;
            searchKey.type = "partition-key";
            if (typeof requestBody.contactId !== 'string') {
                response.body = "Invalid contact ID criteria";
                response.statusCode = Constants.INTERNAL_ERROR;
                return response;
            }
        }
        const httpMethod = event.httpMethod;
        let updateResponse;
        if (httpMethod === Constants.POST) {
            updateResponse = await contactApi.addContactSubscriptions(searchKey, listId);
            console.log("Contact updated", updateResponse);
            response.body = updateResponse.body;
            response.statusCode = updateResponse.statusCode;
        }
        else if (httpMethod === Constants.DELETE) {
            updateResponse = await contactApi.deleteContactSubscriptions(searchKey, listId);
            console.log("Contact updated", updateResponse);
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
    console.log("Response from update Lambda", JSON.stringify(response));
    return response;
}
exports.updateContactSubscriptionsHandler = updateContactSubscriptionsHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLWNvbnRhY3Qtc3Vic2NyaXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sYW1iZGEvUmVmZXJlbmNlcy91cGRhdGUtY29udGFjdC1zdWJzY3JpcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBRS9CLGlFQUFrRDtBQUNsRCwyREFBNEM7QUFFNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFFNUMsS0FBSyxVQUFVLGlDQUFpQyxDQUFDLEtBQTJCO0lBRWpGLElBQUksUUFBUSxHQUFHO1FBQ2IsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkM7UUFDRCxlQUFlLEVBQUUsS0FBSztRQUN0QixJQUFJLEVBQUUsRUFBRTtLQUNULENBQUE7SUFFRCxJQUFJO1FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFFbkQsMkNBQTJDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUE7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFFN0IsMEVBQTBFO1FBQzFFLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ3pDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLENBQUE7WUFDdkMsUUFBUSxDQUFDLFVB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QUFDLGNBQWMsQ0FBQTtZQUM5QyxPQUFPLFFBQVEsQ0FBQTtTQUNoQjtLQUVGO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7WUFDMUIsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFBO1lBQzdCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQTtTQUN0QztLQUNGO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDcEUsT0FBTyxRQUFRLENBQUE7QUFFakIsQ0FBQztBQWhHRCw4RUFnR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlFdmVudCwgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSAnYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIENvbnN0YW50cyBmcm9tICcuLi8uLi91dGlscy9jb25zdGFudHMnXG5pbXBvcnQgKiBhcyBjb250YWN0QXBpIGZyb20gJy4uLy4uL2FwaS91c2VyJ1xuXG5BV1MuY29uZmlnLnVwZGF0ZSh7IHJlZ2lvbjogQ29uc3RhbnRzLkFXU19SRUdJT04gfSlcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvbnRhY3RTdWJzY3JpcHRpb25zSGFuZGxlcihldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4ge1xuXG4gIGxldCByZXNwb25zZSA9IHtcbiAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gICAgYm9keTogJydcbiAgfVxuXG4gIHRyeSB7XG5cbiAgICBjb25zdCBldmVudEJvZHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGV2ZW50IHx8ICd7fScpKVxuICAgIGNvbnNvbGUubG9nKFwiVG8gYmUgdXBkYXRlZCBldmVudCBkYXRhIFwiLCBldmVudEJvZHkpXG5cbiAgICAvLyBFeHRyYWN0IGxpc3RJZCBmcm9tIHRoZSBwYXRoIHBhcmFtZXRlcnMuXG4gICAgY29uc3QgbGlzdElkID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzPy5saXN0SWRcbiAgICBjb25zb2xlLmxvZyhcImxpc3RJZFwiLCBsaXN0SWQpXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgbGlzdElkIGlzIHZhbGlkICh5b3UgY2FuIGltcGxlbWVudCB5b3VyIHZhbGlkYXRpb24gbG9naWMpLlxuICAgIGlmICghbGlzdElkIHx8IHR5cGVvZiBsaXN0SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXNwb25zZS5ib2R5ID0gXCJJbnZhbGlkIGxpc3RJZCBmb3JtYXRcIlxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUlxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdEJvZHkgPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkgfHwgJ3t9JylcbiAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RCb2R5XCIsIHJlcXVlc3RCb2R5KVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBheWxvYWQgaGFzIHRoZSByZXF1aXJlZCBlbWFpbCBmaWVsZC5cbiAgICBpZiAoXG4gICAgICAoIXJlcXVlc3RCb2R5LmVtYWlsIHx8IHR5cGVvZiByZXF1ZXN0Qm9keS5lbWFpbCAhPT0gJ3N0cmluZycpICYmXG4gICAgICAoIXJlcXVlc3RCb2R5LmNvbnRhY3RJZCB8fCB0eXBlb2YgcmVxdWVzdEJvZHkuY29udGFjdElkICE9PSAnc3RyaW5nJylcbiAgICApIHtcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSBcIkludmFsaWQgcmVxdWVzdCBmb3JtYXRcIlxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUlxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuXG4gICAgbGV0IHNlYXJjaEtleSA9IHtcbiAgICAgIGtleTogJycsXG4gICAgICB0eXBlOiAnJ1xuICAgIH1cblxuICAgIGlmIChyZXF1ZXN0Qm9keS5lbWFpbCkge1xuICAgICAgc2VhcmNoS2V5LmtleSA9IHJlcXVlc3RCb2R5LmVtYWlsXG4gICAgICBzZWFyY2hLZXkudHlwZSA9IFwic29ydC1rZXlcIlxuXG4gICAgICBjb25zdCBlbWFpbFZhbGlkYXRpb25FcnJvciA9IGNvbnRhY3RBcGkudmFsaWRhdGVFbWFpbChyZXF1ZXN0Qm9keS5lbWFpbClcbiAgICAgIGlmIChlbWFpbFZhbGlkYXRpb25FcnJvci5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3BvbnNlLmJvZHkgPSBcIkludmFsaWQgZW1haWwgZm9ybWF0XCJcbiAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUlxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAocmVxdWVzdEJvZHkuY29udGFjdElkKSB7XG4gICAgICBzZWFyY2hLZXkua2V5ID0gcmVxdWVzdEJvZHkuY29udGFjdElkXG4gICAgICBzZWFyY2hLZXkudHlwZSA9IFwicGFydGl0aW9uLWtleVwiXG5cbiAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEJvZHkuY29udGFjdElkICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXNwb25zZS5ib2R5ID0gXCJJbnZhbGlkIGNvbnRhY3QgSUQgY3JpdGVyaWFcIlxuICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLklOVEVSTkFMX0VSUk9SXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGh0dHBNZXRob2QgPSBldmVudC5odHRwTWV0aG9kXG4gICAgbGV0IHVwZGF0ZVJlc3BvbnNlXG4gICAgaWYgKGh0dHBNZXRob2QgPT09IENvbnN0YW50cy5QT1NUKSB7XG4gICAgICB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IGNvbnRhY3RBcGkuYWRkQ29udGFjdFN1YnNjcmlwdGlvbnMoc2VhcmNoS2V5LCBsaXN0SWQpXG4gICAgICBjb25zb2xlLmxvZyhcIkNvbnRhY3QgdXBkYXRlZFwiLCB1cGRhdGVSZXNwb25zZSlcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSB1cGRhdGVSZXNwb25zZS5ib2R5XG4gICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gdXBkYXRlUmVzcG9uc2Uuc3RhdHVzQ29kZVxuICAgIH0gZWxzZSBpZiAoaHR0cE1ldGhvZCA9PT0gQ29uc3RhbnRzLkRFTEVURSkge1xuICAgICAgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCBjb250YWN0QXBpLmRlbGV0ZUNvbnRhY3RTdWJzY3JpcHRpb25zKHNlYXJjaEtleSwgbGlzdElkKVxuICAgICAgY29uc29sZS5sb2coXCJDb250YWN0IHVwZGF0ZWRcIiwgdXBkYXRlUmVzcG9uc2UpXG4gICAgICByZXNwb25zZS5ib2R5ID0gdXBkYXRlUmVzcG9uc2UuYm9keVxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IHVwZGF0ZVJlc3BvbnNlLnN0YXR1c0NvZGVcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UuYm9keSA9IFwiSW52YWxpZCByZXF1ZXN0XCJcbiAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSBDb25zdGFudHMuSU5URVJOQUxfRVJST1JcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXNwb25zZS5ib2R5ID0gZXJyb3IubWVzc2FnZVxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5FUlJPUlxuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgZnJvbSB1cGRhdGUgTGFtYmRhXCIsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSlcbiAgcmV0dXJuIHJlc3BvbnNlXG5cbn0iXX0=