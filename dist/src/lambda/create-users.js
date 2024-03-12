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
exports.createUserHandler = void 0;
const Constants = __importStar(require("../utils/constants"));
const contactApi = __importStar(require("../api/user"));
const AWS = require("aws-sdk");
AWS.config.update({ region: Constants.AWS_REGION });
async function createUserHandler(event) {
    console.log("Event Starting");
    var createdUser;
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json'
        },
        isBase64Encoded: false,
        body: ''
    };
    console.log("Event body is" + JSON.stringify(event.body));
    //const bodyData = JSON.parse(JSON.stringify(event.body || '{}'))
    const bodyData = event.body || '{}';
    console.log("Event Body", bodyData);
    // Extract user details from the path parameters.
    const userEmail = event.queryStringParameters?.userEmail;
    const name = event.queryStringParameters?.name;
    if (!userEmail) {
        response.body = "Validation Error - User missing required field email";
        response.statusCode = Constants.ERROR;
        console.log("Response from create Lambda: 1 ", JSON.stringify(response));
        return response;
    }
    if (!name) {
        response.body = "Validation Error - User missing required field name";
        response.statusCode = Constants.ERROR;
        console.log("Response from create Lambda: 1 ", JSON.stringify(response));
        return response;
    }
    var user = await contactApi.createUser(userEmail, name);
    console.log("Contact Created", JSON.stringify(user));
    var createdUser;
    if (response.statusCode = 200) {
        // Query for the contact that was successfully created and return that in response
        createdUser = await contactApi.retrieveUserByEmail(userEmail);
        console.log("createdContact", createdUser);
        // Beautify the JSON string with indentation (2 spaces)
        const beautifiedBody = JSON.stringify(createdUser, null, 2);
        response.body = beautifiedBody;
    }
    console.log("Response from create Lambda", JSON.stringify(response));
    return response;
}
exports.createUserHandler = createUserHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXVzZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xhbWJkYS9jcmVhdGUtdXNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSw4REFBK0M7QUFDL0Msd0RBQXlDO0FBR3pDLCtCQUErQjtBQUUvQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtBQUU1QyxLQUFLLFVBQVUsaUJBQWlCLENBQUMsS0FBMkI7SUFFakUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRTdCLElBQUksV0FBVyxDQUFDO0lBRWhCLElBQUksUUFBUSxHQUFHO1FBQ2IsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCw2QkFBNkIsRUFBRSxHQUFHO1lBQ2xDLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkM7UUFDRCxlQUFlLEVBQUUsS0FBSztRQUN0QixJQUFJLEVBQUUsRUFBRTtLQUNULENBQUE7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBRXpELGlFQUFpRTtJQUNqRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQTtJQUduQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUVuQyxpREFBaUQ7SUFDakQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQTtJQUN4RCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFBO0lBRzlDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxRQUFRLENBQUMsSUFBSSxHQUFHLHNEQUFzRCxDQUFBO1FBQ3RFLFFBQVEsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUN4RSxPQUFPLFFBQVEsQ0FBQTtLQUNoQjtJQUdELElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxRQUFRLENBQUMsSUFBSSxHQUFHLHFEQUFxRCxDQUFBO1FBQ3JFLFFBQVEsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUN4RSxPQUFPLFFBQVEsQ0FBQTtLQUNoQjtJQUVELElBQUksSUFBSSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFcEQsSUFBSSxXQUFXLENBQUM7SUFDaEIsSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRTtRQUU3QixrRkFBa0Y7UUFDbEYsV0FBVyxHQUFHLE1BQU0sVUFBVSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFFMUMsdURBQXVEO1FBQ3ZELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzRCxRQUFRLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQTtLQUMvQjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQ3BFLE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUE1REQsOENBNERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQsIEFQSUdhdGV3YXlQcm94eVJlc3VsdCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgeyBVc2VyVHlwZSB9IGZyb20gJy4uL3V0aWxzL3VzZXInXG5pbXBvcnQgeyByZWFkVXNlckZyb21FdmVudCB9IGZyb20gJy4uL2luZGV4J1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCdcblxuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cydcbmltcG9ydCAqIGFzIGNvbnRhY3RBcGkgZnJvbSAnLi4vYXBpL3VzZXInXG5pbXBvcnQgKiBhcyBwaW5wb2ludEFwaSBmcm9tICcuLi9hcGkvcGlucG9pbnQnXG5cbmltcG9ydCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJylcblxuQVdTLmNvbmZpZy51cGRhdGUoeyByZWdpb246IENvbnN0YW50cy5BV1NfUkVHSU9OIH0pXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVVc2VySGFuZGxlcihldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4ge1xuXG4gIGNvbnNvbGUubG9nKFwiRXZlbnQgU3RhcnRpbmdcIilcblxuICB2YXIgY3JlYXRlZFVzZXI7XG5cbiAgbGV0IHJlc3BvbnNlID0ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICBib2R5OiAnJ1xuICB9XG5cbiAgY29uc29sZS5sb2coXCJFdmVudCBib2R5IGlzXCIgKyBKU09OLnN0cmluZ2lmeShldmVudC5ib2R5KSlcblxuICAvL2NvbnN0IGJvZHlEYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShldmVudC5ib2R5IHx8ICd7fScpKVxuICBjb25zdCBib2R5RGF0YSA9IGV2ZW50LmJvZHkgfHwgJ3t9J1xuXG5cbiAgY29uc29sZS5sb2coXCJFdmVudCBCb2R5XCIsIGJvZHlEYXRhKVxuXG4gIC8vIEV4dHJhY3QgdXNlciBkZXRhaWxzIGZyb20gdGhlIHBhdGggcGFyYW1ldGVycy5cbiAgY29uc3QgdXNlckVtYWlsID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzPy51c2VyRW1haWxcbiAgY29uc3QgbmFtZSA9IGV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycz8ubmFtZVxuXG5cbiAgaWYgKCF1c2VyRW1haWwpIHtcbiAgICByZXNwb25zZS5ib2R5ID0gXCJWYWxpZGF0aW9uIEVycm9yIC0gVXNlciBtaXNzaW5nIHJlcXVpcmVkIGZpZWxkIGVtYWlsXCJcbiAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLkVSUk9SXG4gICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIGNyZWF0ZSBMYW1iZGE6IDEgXCIsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG5cbiAgaWYgKCFuYW1lKSB7XG4gICAgcmVzcG9uc2UuYm9keSA9IFwiVmFsaWRhdGlvbiBFcnJvciAtIFVzZXIgbWlzc2luZyByZXF1aXJlZCBmaWVsZCBuYW1lXCJcbiAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gQ29uc3RhbnRzLkVSUk9SXG4gICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIGNyZWF0ZSBMYW1iZGE6IDEgXCIsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciB1c2VyID0gYXdhaXQgY29udGFjdEFwaS5jcmVhdGVVc2VyKHVzZXJFbWFpbCwgbmFtZSlcbiAgY29uc29sZS5sb2coXCJDb250YWN0IENyZWF0ZWRcIiwgSlNPTi5zdHJpbmdpZnkodXNlcikpXG5cbiAgdmFyIGNyZWF0ZWRVc2VyO1xuICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMCkge1xuXG4gICAgLy8gUXVlcnkgZm9yIHRoZSBjb250YWN0IHRoYXQgd2FzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkIGFuZCByZXR1cm4gdGhhdCBpbiByZXNwb25zZVxuICAgIGNyZWF0ZWRVc2VyID0gYXdhaXQgY29udGFjdEFwaS5yZXRyaWV2ZVVzZXJCeUVtYWlsKHVzZXJFbWFpbClcbiAgICBjb25zb2xlLmxvZyhcImNyZWF0ZWRDb250YWN0XCIsIGNyZWF0ZWRVc2VyKVxuXG4gICAgLy8gQmVhdXRpZnkgdGhlIEpTT04gc3RyaW5nIHdpdGggaW5kZW50YXRpb24gKDIgc3BhY2VzKVxuICAgIGNvbnN0IGJlYXV0aWZpZWRCb2R5ID0gSlNPTi5zdHJpbmdpZnkoY3JlYXRlZFVzZXIsIG51bGwsIDIpXG4gICAgcmVzcG9uc2UuYm9keSA9IGJlYXV0aWZpZWRCb2R5XG4gIH1cbiAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIGNyZWF0ZSBMYW1iZGFcIiwgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKVxuICByZXR1cm4gcmVzcG9uc2Vcbn0iXX0=