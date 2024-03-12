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
exports.retrieveContactHandler = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../utils/constants"));
const contactApi = __importStar(require("../api/user"));
AWS.config.update({ region: 'us-east-1' });
AWS.config.update({ region: Constants.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function retrieveContactHandler(event) {
    console.log("Event", event);
    const region = 'us-east-1';
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json'
        },
        isBase64Encoded: false,
        body: ''
    };
    console.log("Event Body is " + JSON.stringify(event.body));
    // Extract email from the path parameters.
    const email = event.queryStringParameters?.email;
    console.log("Email", email);
    // Extract email from the path parameters.
    const contactId = event.queryStringParameters?.contactId;
    console.log("contactId", contactId);
    // Check if the listId is valid (you can implement your validation logic).
    if ((!email || typeof email !== 'string') && (!contactId || typeof contactId !== 'string')) {
        response.body = "Missing search criteria";
        response.statusCode = Constants.INTERNAL_ERROR;
        console.log("Response 1", response);
        return response;
    }
    if (email) {
        const emailValidationError = contactApi.validateEmail(email);
        if (emailValidationError.length > 0) {
            response.body = "Invalid search criteria";
            response.statusCode = Constants.INTERNAL_ERROR;
            console.log("Response 3", response);
            return response;
        }
    }
    const bodyData = JSON.parse(JSON.stringify(event.body || '{}'));
    console.log("Body Data", bodyData);
    let contact;
    try {
        if (contactId) {
            console.log("Invoking retrieveContactById");
            contact = await contactApi.retrieveContactById(contactId);
        }
        else if (email) {
            console.log("Invoking retrieveContactByEmail");
            contact = await contactApi.retrieveContactByEmail(email);
        }
        console.log("Fetched Contact", contact);
        if (!contact || contact.length == 0) {
            response = {
                statusCode: Constants.DOES_NOT_EXIST,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'content-type': 'application/json'
                },
                isBase64Encoded: false,
                body: 'Contact not found'
            };
            return response;
        }
        // Beautify the JSON string with indentation (2 spaces)
        const beautifiedBody = JSON.stringify(contact, null, 2);
        response.body = beautifiedBody;
    }
    catch (error) {
        response = {
            statusCode: Constants.ERROR,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json'
            },
            isBase64Encoded: false,
            body: 'Contact not found'
        };
        throw error;
    }
    console.log("Response from query Lambda", response);
    return response;
}
exports.retrieveContactHandler = retrieveContactHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXVzZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xhbWJkYS9nZXQtdXNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFL0IsOERBQStDO0FBQy9DLHdEQUF5QztBQUV6QyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0FBRTFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO0FBQ25ELE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUUzQyxLQUFLLFVBQVUsc0JBQXNCLENBQUMsS0FBMkI7SUFFdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDM0IsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFBO0lBRTFCLElBQUksUUFBUSxHQUFHO1FBQ2IsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkM7UUFDRCxlQUFlLEVBQUUsS0FBSztRQUN0QixJQUFJLEVBQUUsRUFBRTtLQUNULENBQUE7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFMUQsMENBQTBDO0lBQzFDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUE7SUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFFM0IsMENBQTBDO0lBQzFDLE1BQU0s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QUFBO0lBRW5ELE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUEvRkQsd0RBK0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQsIEFQSUdhdGV3YXlQcm94eVJlc3VsdCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJ1xuaW1wb3J0ICogYXMgY29udGFjdEFwaSBmcm9tICcuLi9hcGkvdXNlcidcblxuQVdTLmNvbmZpZy51cGRhdGUoeyByZWdpb246ICd1cy1lYXN0LTEnIH0pXG5cbkFXUy5jb25maWcudXBkYXRlKHsgcmVnaW9uOiBDb25zdGFudHMuQVdTX1JFR0lPTiB9KVxuY29uc3QgZHluYW1vREIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KClcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJldHJpZXZlQ29udGFjdEhhbmRsZXIoZXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50KTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+IHtcblxuICBjb25zb2xlLmxvZyhcIkV2ZW50XCIsIGV2ZW50KVxuICBjb25zdCByZWdpb24gPSAndXMtZWFzdC0xJ1xuXG4gIGxldCByZXNwb25zZSA9IHtcbiAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gICAgYm9keTogJydcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiRXZlbnQgQm9keSBpcyBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50LmJvZHkpKVxuXG4gIC8vIEV4dHJhY3QgZW1haWwgZnJvbSB0aGUgcGF0aCBwYXJhbWV0ZXJzLlxuICBjb25zdCBlbWFpbCA9IGV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycz8uZW1haWxcbiAgY29uc29sZS5sb2coXCJFbWFpbFwiLCBlbWFpbClcblxuICAvLyBFeHRyYWN0IGVtYWlsIGZyb20gdGhlIHBhdGggcGFyYW1ldGVycy5cbiAgY29uc3QgY29udGFjdElkID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzPy5jb250YWN0SWRcbiAgY29uc29sZS5sb2coXCJjb250YWN0SWRcIiwgY29udGFjdElkKVxuXG4gIC8vIENoZWNrIGlmIHRoZSBsaXN0SWQgaXMgdmFsaWQgKHlvdSBjYW4gaW1wbGVtZW50IHlvdXIgdmFsaWRhdGlvbiBsb2dpYykuXG4gIGlmICgoIWVtYWlsIHx8IHR5cGVvZiBlbWFpbCAhPT0gJ3N0cmluZycpICYmICghY29udGFjdElkIHx8IHR5cGVvZiBjb250YWN0SWQgIT09ICdzdHJpbmcnKSkge1xuICAgIHJlc3BvbnNlLmJvZHkgPSBcIk1pc3Npbmcgc2VhcmNoIGNyaXRlcmlhXCJcbiAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLklOVEVSTkFMX0VSUk9SXG4gICAgY29uc29sZS5sb2coXCJSZXNwb25zZSAxXCIsIHJlc3BvbnNlKVxuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgaWYgKGVtYWlsKSB7XG4gICAgY29uc3QgZW1haWxWYWxpZGF0aW9uRXJyb3IgPSBjb250YWN0QXBpLnZhbGlkYXRlRW1haWwoZW1haWwgYXMgc3RyaW5nKVxuICAgIGlmIChlbWFpbFZhbGlkYXRpb25FcnJvci5sZW5ndGggPiAwKSB7XG4gICAgICByZXNwb25zZS5ib2R5ID0gXCJJbnZhbGlkIHNlYXJjaCBjcml0ZXJpYVwiXG4gICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLklOVEVSTkFMX0VSUk9SXG4gICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIDNcIiwgcmVzcG9uc2UpXG5cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJvZHlEYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShldmVudC5ib2R5IHx8ICd7fScpKVxuICBjb25zb2xlLmxvZyhcIkJvZHkgRGF0YVwiLCBib2R5RGF0YSlcblxuICBsZXQgY29udGFjdFxuXG4gIHRyeSB7XG5cbiAgICBpZiAoY29udGFjdElkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkludm9raW5nIHJldHJpZXZlQ29udGFjdEJ5SWRcIilcblxuICAgICAgY29udGFjdCA9IGF3YWl0IGNvbnRhY3RBcGkucmV0cmlldmVDb250YWN0QnlJZChjb250YWN0SWQpXG4gICAgfSBlbHNlIGlmIChlbWFpbCkge1xuICAgICAgY29uc29sZS5sb2coXCJJbnZva2luZyByZXRyaWV2ZUNvbnRhY3RCeUVtYWlsXCIpXG5cbiAgICAgIGNvbnRhY3QgPSBhd2FpdCBjb250YWN0QXBpLnJldHJpZXZlQ29udGFjdEJ5RW1haWwoZW1haWwpXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBDb250YWN0XCIsIGNvbnRhY3QpXG5cbiAgICBpZiAoIWNvbnRhY3QgfHwgY29udGFjdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1c0NvZGU6IENvbnN0YW50cy5ET0VTX05PVF9FWElTVCxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LFxuICAgICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgICBib2R5OiAnQ29udGFjdCBub3QgZm91bmQnXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9XG4gICAgLy8gQmVhdXRpZnkgdGhlIEpTT04gc3RyaW5nIHdpdGggaW5kZW50YXRpb24gKDIgc3BhY2VzKVxuICAgIGNvbnN0IGJlYXV0aWZpZWRCb2R5ID0gSlNPTi5zdHJpbmdpZnkoY29udGFjdCwgbnVsbCwgMilcbiAgICByZXNwb25zZS5ib2R5ID0gYmVhdXRpZmllZEJvZHlcblxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzcG9uc2UgPSB7XG4gICAgICBzdGF0dXNDb2RlOiBDb25zdGFudHMuRVJST1IsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgYm9keTogJ0NvbnRhY3Qgbm90IGZvdW5kJ1xuICAgIH1cbiAgICB0aHJvdyBlcnJvclxuICB9XG5cbiAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIHF1ZXJ5IExhbWJkYVwiLCByZXNwb25zZSlcblxuICByZXR1cm4gcmVzcG9uc2Vcbn1cbiJdfQ==