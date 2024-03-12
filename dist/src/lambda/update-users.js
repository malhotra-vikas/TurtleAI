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
exports.updateContactHandler = void 0;
const AWS = require("aws-sdk");
const index_1 = require("../index");
const Constants = __importStar(require("../utils/constants"));
const contactApi = __importStar(require("../api/user"));
AWS.config.update({ region: Constants.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function updateContactHandler(event) {
    console.log("Event starting");
    const region = Constants.AWS_REGION;
    var updatedContact;
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json'
        },
        isBase64Encoded: false,
        body: ''
    };
    // console.log("Event Body is " + JSON.stringify(event.body))
    // Extract email from the path parameters.
    const contactId_ToFetchAndUpdate = event.queryStringParameters?.contactId;
    console.log("contactId", contactId_ToFetchAndUpdate);
    // Check if the listId is valid (you can implement your validation logic).
    if (!contactId_ToFetchAndUpdate) {
        response.body = "Missing search criteria";
        response.statusCode = Constants.INTERNAL_ERROR;
        console.log("Response 3:", response);
        return response;
    }
    if (typeof contactId_ToFetchAndUpdate !== 'string') {
        response.body = "Invalid search criteria";
        response.statusCode = Constants.INTERNAL_ERROR;
        console.log("Response 4:", response);
        return response;
    }
    console.log("Running fetch and updates for contactId ", contactId_ToFetchAndUpdate);
    const eventBodyData = event.body || '{}';
    console.log("To be updated body data", eventBodyData);
    const userFromEventBody = await (0, index_1.readUserFromEvent)(eventBodyData);
    userFromEventBody.contactId = contactId_ToFetchAndUpdate;
    console.log("To be updated user data is", userFromEventBody);
    if (userFromEventBody.phone) {
        const phoneValidationError = contactApi.validatePhone(userFromEventBody.phone);
        if (phoneValidationError.length > 0) {
            response.body = phoneValidationError[0];
            response.statusCode = Constants.INTERNAL_ERROR;
            console.log("Response 2:", response);
            return response;
        }
    }
    var existingUser = { email: "x@x.com", contactId: "x" };
    var updateResponse;
    const currentContacts = await contactApi.retrieveContactById(contactId_ToFetchAndUpdate);
    var currentContact;
    if (currentContacts) {
        currentContact = currentContacts[0];
        if (!currentContact) {
            response.body = "No contact found by that ID";
            response.statusCode = Constants.DOES_NOT_EXIST;
            return response;
        }
        existingUser.firstName = currentContact['firstName'];
        existingUser.lastName = currentContact['lastName'];
        existingUser.email = currentContact['email'];
        existingUser.phone = currentContact['phone'];
        existingUser.lists = currentContact['lists'];
        existingUser.tags = currentContact['tags'];
        existingUser.customFields = currentContact['customFields'];
        existingUser.owner = currentContact['owner'];
        existingUser.contactId = contactId_ToFetchAndUpdate;
    }
    console.log("To be compared and updated - current user in DB", existingUser);
    //currentUser = await readUserFromUpdateEvent(JSON.stringify(currentContact))
    //console.log("currentUser  ", currentUser)
    updateResponse = await contactApi.updateContactById(contactId_ToFetchAndUpdate, existingUser, userFromEventBody);
    console.log("Contact updated", updateResponse);
    if (updateResponse.statusCode == Constants.SUCCESS) {
        // Query for the contact that was successfully updated and return that in response
        updatedContact = await contactApi.retrieveContactById(contactId_ToFetchAndUpdate);
        console.log("Updated contact", updatedContact);
        // Beautify the JSON string with indentation (2 spaces)
        const beautifiedBody = JSON.stringify(updatedContact, null, 2);
        response.body = beautifiedBody;
    }
    else {
        response.body = updateResponse.body;
        response.statusCode = updateResponse.statusCode;
    }
    console.log("Response from update Lambda", JSON.stringify(response));
    return response;
}
exports.updateContactHandler = updateContactHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXVzZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xhbWJkYS91cGRhdGUtdXNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFHL0Isb0NBQXFFO0FBQ3JFLDhEQUErQztBQUMvQyx3REFBeUM7QUFFekMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDbkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBRTNDLEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxLQUEyQjtJQUVwRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDN0IsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQTtJQUNuQyxJQUFJLGNBQWMsQ0FBQTtJQUVsQixJQUFJLFFBQVEsR0FBRztRQUNiLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRztZQUNsQyxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO1FBQ0QsZUFBZSxFQUFFLEtBQUs7UUFDdEIsSUFBSSxFQUFFLEVBQUU7S0FDVCxDQUFBO0lBQ0QsNkRBQTZEO0lBRTdELDBDQUEwQztJQUMxQyxNQUFNLDBCQUEwQixHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUE7SUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsMEJBQTBCLENBQUMsQ0FBQTtJQUVwRCwwRUFBMEU7SUFDMUUsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1FBQy9CLFFBQVEsQ0FBQyxJQUFJLEdBQUcseUJBQXlCLENBQUE7UUFDekMsUUFBUSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFB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RTVFLDZFQUE2RTtJQUU3RSwyQ0FBMkM7SUFDM0MsY0FBYyxHQUFHLE1BQU0sVUFBVSxDQUFDLGlCQUFpQixDQUFDLDBCQUEwQixFQUFFLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO0lBQ2hILE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUE7SUFFOUMsSUFBSSxjQUFjLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUU7UUFDbEQsa0ZBQWtGO1FBQ2xGLGNBQWMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFFOUMsdURBQXVEO1FBQ3ZELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM5RCxRQUFRLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQTtLQUUvQjtTQUFNO1FBQ0wsUUFBUSxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFBO1FBQ25DLFFBQVEsQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQTtLQUNoRDtJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQ3BFLE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUEzR0Qsb0RBMkdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKVxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQsIEFQSUdhdGV3YXlQcm94eVJlc3VsdCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgeyBVc2VyVHlwZSB9IGZyb20gJy4uL3V0aWxzL3VzZXInXG5pbXBvcnQgeyByZWFkVXNlckZyb21FdmVudCwgcmVhZFVzZXJGcm9tVXBkYXRlRXZlbnQgfSBmcm9tICcuLi9pbmRleCdcbmltcG9ydCAqIGFzIENvbnN0YW50cyBmcm9tICcuLi91dGlscy9jb25zdGFudHMnXG5pbXBvcnQgKiBhcyBjb250YWN0QXBpIGZyb20gJy4uL2FwaS91c2VyJ1xuXG5BV1MuY29uZmlnLnVwZGF0ZSh7IHJlZ2lvbjogQ29uc3RhbnRzLkFXU19SRUdJT04gfSlcbmNvbnN0IGR5bmFtb0RCID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDb250YWN0SGFuZGxlcihldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4ge1xuXG4gIGNvbnNvbGUubG9nKFwiRXZlbnQgc3RhcnRpbmdcIilcbiAgY29uc3QgcmVnaW9uID0gQ29uc3RhbnRzLkFXU19SRUdJT05cbiAgdmFyIHVwZGF0ZWRDb250YWN0XG5cbiAgbGV0IHJlc3BvbnNlID0ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICBib2R5OiAnJ1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKFwiRXZlbnQgQm9keSBpcyBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50LmJvZHkpKVxuXG4gIC8vIEV4dHJhY3QgZW1haWwgZnJvbSB0aGUgcGF0aCBwYXJhbWV0ZXJzLlxuICBjb25zdCBjb250YWN0SWRfVG9GZXRjaEFuZFVwZGF0ZSA9IGV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycz8uY29udGFjdElkXG4gIGNvbnNvbGUubG9nKFwiY29udGFjdElkXCIsIGNvbnRhY3RJZF9Ub0ZldGNoQW5kVXBkYXRlKVxuXG4gIC8vIENoZWNrIGlmIHRoZSBsaXN0SWQgaXMgdmFsaWQgKHlvdSBjYW4gaW1wbGVtZW50IHlvdXIgdmFsaWRhdGlvbiBsb2dpYykuXG4gIGlmICghY29udGFjdElkX1RvRmV0Y2hBbmRVcGRhdGUpIHtcbiAgICByZXNwb25zZS5ib2R5ID0gXCJNaXNzaW5nIHNlYXJjaCBjcml0ZXJpYVwiXG4gICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUlxuICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgMzpcIiwgcmVzcG9uc2UpXG5cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIGlmICh0eXBlb2YgY29udGFjdElkX1RvRmV0Y2hBbmRVcGRhdGUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmVzcG9uc2UuYm9keSA9IFwiSW52YWxpZCBzZWFyY2ggY3JpdGVyaWFcIlxuICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSBDb25zdGFudHMuSU5URVJOQUxfRVJST1JcbiAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIDQ6XCIsIHJlc3BvbnNlKVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgZmV0Y2ggYW5kIHVwZGF0ZXMgZm9yIGNvbnRhY3RJZCBcIiwgY29udGFjdElkX1RvRmV0Y2hBbmRVcGRhdGUpXG5cbiAgY29uc3QgZXZlbnRCb2R5RGF0YSA9IGV2ZW50LmJvZHkgfHwgJ3t9J1xuXG4gIGNvbnNvbGUubG9nKFwiVG8gYmUgdXBkYXRlZCBib2R5IGRhdGFcIiwgZXZlbnRCb2R5RGF0YSlcblxuICBjb25zdCB1c2VyRnJvbUV2ZW50Qm9keTogVXNlclR5cGUgPSBhd2FpdCByZWFkVXNlckZyb21FdmVudChldmVudEJvZHlEYXRhKVxuICB1c2VyRnJvbUV2ZW50Qm9keS5jb250YWN0SWQgPSBjb250YWN0SWRfVG9GZXRjaEFuZFVwZGF0ZVxuXG4gIGNvbnNvbGUubG9nKFwiVG8gYmUgdXBkYXRlZCB1c2VyIGRhdGEgaXNcIiwgdXNlckZyb21FdmVudEJvZHkpXG5cbiAgaWYgKHVzZXJGcm9tRXZlbnRCb2R5LnBob25lKSB7XG4gICAgY29uc3QgcGhvbmVWYWxpZGF0aW9uRXJyb3IgPSBjb250YWN0QXBpLnZhbGlkYXRlUGhvbmUodXNlckZyb21FdmVudEJvZHkucGhvbmUgYXMgc3RyaW5nKVxuICAgIGlmIChwaG9uZVZhbGlkYXRpb25FcnJvci5sZW5ndGggPiAwKSB7XG4gICAgICByZXNwb25zZS5ib2R5ID0gcGhvbmVWYWxpZGF0aW9uRXJyb3JbMF1cbiAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSBDb25zdGFudHMuSU5URVJOQUxfRVJST1JcbiAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgMjpcIiwgcmVzcG9uc2UpXG5cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cbiAgfVxuXG4gIHZhciBleGlzdGluZ1VzZXI6IFVzZXJUeXBlID0geyBlbWFpbDogXCJ4QHguY29tXCIsIGNvbnRhY3RJZDogXCJ4XCIgfVxuICB2YXIgdXBkYXRlUmVzcG9uc2VcblxuICBjb25zdCBjdXJyZW50Q29udGFjdHMgPSBhd2FpdCBjb250YWN0QXBpLnJldHJpZXZlQ29udGFjdEJ5SWQoY29udGFjdElkX1RvRmV0Y2hBbmRVcGRhdGUpXG4gIHZhciBjdXJyZW50Q29udGFjdFxuICBpZiAoY3VycmVudENvbnRhY3RzKSB7XG4gICAgY3VycmVudENvbnRhY3QgPSBjdXJyZW50Q29udGFjdHNbMF1cblxuICAgIGlmICghY3VycmVudENvbnRhY3QpIHtcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSBcIk5vIGNvbnRhY3QgZm91bmQgYnkgdGhhdCBJRFwiXG4gICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLkRPRVNfTk9UX0VYSVNUXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9XG4gICAgZXhpc3RpbmdVc2VyLmZpcnN0TmFtZSA9IGN1cnJlbnRDb250YWN0WydmaXJzdE5hbWUnXVxuICAgIGV4aXN0aW5nVXNlci5sYXN0TmFtZSA9IGN1cnJlbnRDb250YWN0WydsYXN0TmFtZSddXG4gICAgZXhpc3RpbmdVc2VyLmVtYWlsID0gY3VycmVudENvbnRhY3RbJ2VtYWlsJ11cbiAgICBleGlzdGluZ1VzZXIucGhvbmUgPSBjdXJyZW50Q29udGFjdFsncGhvbmUnXVxuICAgIGV4aXN0aW5nVXNlci5saXN0cyA9IGN1cnJlbnRDb250YWN0WydsaXN0cyddXG4gICAgZXhpc3RpbmdVc2VyLnRhZ3MgPSBjdXJyZW50Q29udGFjdFsndGFncyddXG4gICAgZXhpc3RpbmdVc2VyLmN1c3RvbUZpZWxkcyA9IGN1cnJlbnRDb250YWN0WydjdXN0b21GaWVsZHMnXVxuICAgIGV4aXN0aW5nVXNlci5vd25lciA9IGN1cnJlbnRDb250YWN0Wydvd25lciddXG4gICAgZXhpc3RpbmdVc2VyLmNvbnRhY3RJZCA9IGNvbnRhY3RJZF9Ub0ZldGNoQW5kVXBkYXRlXG4gIH1cbiAgY29uc29sZS5sb2coXCJUbyBiZSBjb21wYXJlZCBhbmQgdXBkYXRlZCAtIGN1cnJlbnQgdXNlciBpbiBEQlwiLCBleGlzdGluZ1VzZXIpXG5cbiAgLy9jdXJyZW50VXNlciA9IGF3YWl0IHJlYWRVc2VyRnJvbVVwZGF0ZUV2ZW50KEpTT04uc3RyaW5naWZ5KGN1cnJlbnRDb250YWN0KSlcblxuICAvL2NvbnNvbGUubG9nKFwiY3VycmVudFVzZXIgIFwiLCBjdXJyZW50VXNlcilcbiAgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCBjb250YWN0QXBpLnVwZGF0ZUNvbnRhY3RCeUlkKGNvbnRhY3RJZF9Ub0ZldGNoQW5kVXBkYXRlLCBleGlzdGluZ1VzZXIsIHVzZXJGcm9tRXZlbnRCb2R5KVxuICBjb25zb2xlLmxvZyhcIkNvbnRhY3QgdXBkYXRlZFwiLCB1cGRhdGVSZXNwb25zZSlcblxuICBpZiAodXBkYXRlUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSBDb25zdGFudHMuU1VDQ0VTUykge1xuICAgIC8vIFF1ZXJ5IGZvciB0aGUgY29udGFjdCB0aGF0IHdhcyBzdWNjZXNzZnVsbHkgdXBkYXRlZCBhbmQgcmV0dXJuIHRoYXQgaW4gcmVzcG9uc2VcbiAgICB1cGRhdGVkQ29udGFjdCA9IGF3YWl0IGNvbnRhY3RBcGkucmV0cmlldmVDb250YWN0QnlJZChjb250YWN0SWRfVG9GZXRjaEFuZFVwZGF0ZSlcbiAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZWQgY29udGFjdFwiLCB1cGRhdGVkQ29udGFjdClcblxuICAgIC8vIEJlYXV0aWZ5IHRoZSBKU09OIHN0cmluZyB3aXRoIGluZGVudGF0aW9uICgyIHNwYWNlcylcbiAgICBjb25zdCBiZWF1dGlmaWVkQm9keSA9IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRDb250YWN0LCBudWxsLCAyKVxuICAgIHJlc3BvbnNlLmJvZHkgPSBiZWF1dGlmaWVkQm9keVxuXG4gIH0gZWxzZSB7XG4gICAgcmVzcG9uc2UuYm9keSA9IHVwZGF0ZVJlc3BvbnNlLmJvZHlcbiAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gdXBkYXRlUmVzcG9uc2Uuc3RhdHVzQ29kZVxuICB9XG5cbiAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIHVwZGF0ZSBMYW1iZGFcIiwgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKVxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxuXG4iXX0=