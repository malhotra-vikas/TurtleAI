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
exports.createPinpointEndpoint = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../utils/constants"));
AWS.config.update({ region: Constants.AWS_REGION });
const region = Constants.AWS_REGION;
const client_pinpoint_1 = require("@aws-sdk/client-pinpoint");
const pinpointClient = new client_pinpoint_1.PinpointClient({ region: region });
const applicationId = Constants.PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION;
let endpointRequest = {
    ChannelType: "EMAIL",
    Address: '',
    OptOut: "NONE",
    Attributes: {
        // Example attributes
        Interests: []
    }
};
async function createPinpointEndpoint(contactId, interests, email) {
    const endpointId = contactId;
    if (!endpointId) {
        console.error("EndpointId is undefined");
        throw new Error("EndpointId is undefined");
    }
    if (!endpointRequest.Attributes) {
        endpointRequest.Attributes = {};
    }
    if (interests && interests.length > 0) {
        endpointRequest.Attributes.Interests = interests;
    }
    endpointRequest.Address = email;
    console.log("Pinpoint endpointRequest is :" + JSON.stringify(endpointRequest));
    const updateEndpointCommand = new client_pinpoint_1.UpdateEndpointCommand({
        ApplicationId: applicationId,
        EndpointId: endpointId,
        EndpointRequest: endpointRequest
    });
    console.log("Pinpoint updateEndpointCommand is :" + JSON.stringify(updateEndpointCommand));
    try {
        const response = await pinpointClient.send(updateEndpointCommand);
        console.log("Endpoint created/updated:", response);
    }
    catch (error) {
        console.error("Error creating/updating endpoint:", error);
        throw error;
    }
}
exports.createPinpointEndpoint = createPinpointEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlucG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3BpbnBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBRS9CLDhEQUErQztBQUUvQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtBQUNuRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFBO0FBRW5DLDhEQUFpRztBQUNqRyxNQUFNLGNBQWMsR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUM3RCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsMkNBQTJDLENBQUE7QUFFM0UsSUFBSSxlQUFlLEdBQW9CO0lBQ3JDLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLE9BQU8sRUFBRSxFQUFFO0lBQ1gsTUFBTSxFQUFFLE1BQU07SUFDZCxVQUFVLEVBQUU7UUFDVixxQkFBcUI7UUFDckIsU0FBUyxFQUFFLEVBQUU7S0FDZDtDQUNGLENBQUE7QUFFTSxLQUFLLFVBQVUsc0JBQXNCLENBQUMsU0FBaUIsRUFBRSxTQUFtQixFQUFFLEtBQWE7SUFFaEcsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFBO0lBRTVCLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFFeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0tBQzNDO0lBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUU7UUFDL0IsZUFBZSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUE7S0FDaEM7SUFHRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNyQyxlQUFlLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7S0FDakQ7SUFFRCxlQUFlLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtJQUUvQixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUU5RSxNQUFNLHFCQUFxQixHQUFHLElBQUksdUNBQXFCLENBQUM7UUFDdEQsYUFBYSxFQUFFLGFBQWE7UUFDNUIsVUFBVSxFQUFFLFVBQVU7UUFDdEIsZUFBZSxFQUFFLGVBQWU7S0FDakMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQTtJQUUxRixJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7UUFDakUsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNuRDtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN6RCxNQUFNLEtBQUssQ0FBQTtLQUNaO0FBQ0gsQ0FBQztBQXRDRCx3REFzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5cbmltcG9ydCAqIGFzIENvbnN0YW50cyBmcm9tICcuLi91dGlscy9jb25zdGFudHMnXG5cbkFXUy5jb25maWcudXBkYXRlKHsgcmVnaW9uOiBDb25zdGFudHMuQVdTX1JFR0lPTiB9KVxuY29uc3QgcmVnaW9uID0gQ29uc3RhbnRzLkFXU19SRUdJT05cblxuaW1wb3J0IHsgRW5kcG9pbnRSZXF1ZXN0LCBQaW5wb2ludENsaWVudCwgVXBkYXRlRW5kcG9pbnRDb21tYW5kIH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1waW5wb2ludFwiXG5jb25zdCBwaW5wb2ludENsaWVudCA9IG5ldyBQaW5wb2ludENsaWVudCh7IHJlZ2lvbjogcmVnaW9uIH0pXG5jb25zdCBhcHBsaWNhdGlvbklkID0gQ29uc3RhbnRzLlBJTlBPSU5UX0NPTlRBQ1RfQ09NTVVOSUNBVElPTlNfQVBQTElDQVRJT05cblxubGV0IGVuZHBvaW50UmVxdWVzdDogRW5kcG9pbnRSZXF1ZXN0ID0ge1xuICBDaGFubmVsVHlwZTogXCJFTUFJTFwiLFxuICBBZGRyZXNzOiAnJyxcbiAgT3B0T3V0OiBcIk5PTkVcIiwgLy8gJ0FMTCcsICdOT05FJywgb3IgJ1NPTUUnXG4gIEF0dHJpYnV0ZXM6IHtcbiAgICAvLyBFeGFtcGxlIGF0dHJpYnV0ZXNcbiAgICBJbnRlcmVzdHM6IFtdXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBpbnBvaW50RW5kcG9pbnQoY29udGFjdElkOiBzdHJpbmcsIGludGVyZXN0czogW3N0cmluZ10sIGVtYWlsOiBzdHJpbmcpIHtcblxuICBjb25zdCBlbmRwb2ludElkID0gY29udGFjdElkXG5cbiAgaWYgKCFlbmRwb2ludElkKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVuZHBvaW50SWQgaXMgdW5kZWZpbmVkXCIpXG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbmRwb2ludElkIGlzIHVuZGVmaW5lZFwiKVxuICB9XG5cbiAgaWYgKCFlbmRwb2ludFJlcXVlc3QuQXR0cmlidXRlcykge1xuICAgIGVuZHBvaW50UmVxdWVzdC5BdHRyaWJ1dGVzID0ge31cbiAgfVxuXG5cbiAgaWYgKGludGVyZXN0cyAmJiBpbnRlcmVzdHMubGVuZ3RoID4gMCkge1xuICAgIGVuZHBvaW50UmVxdWVzdC5BdHRyaWJ1dGVzLkludGVyZXN0cyA9IGludGVyZXN0c1xuICB9XG5cbiAgZW5kcG9pbnRSZXF1ZXN0LkFkZHJlc3MgPSBlbWFpbFxuXG4gIGNvbnNvbGUubG9nKFwiUGlucG9pbnQgZW5kcG9pbnRSZXF1ZXN0IGlzIDpcIiArIEpTT04uc3RyaW5naWZ5KGVuZHBvaW50UmVxdWVzdCkpXG5cbiAgY29uc3QgdXBkYXRlRW5kcG9pbnRDb21tYW5kID0gbmV3IFVwZGF0ZUVuZHBvaW50Q29tbWFuZCh7XG4gICAgQXBwbGljYXRpb25JZDogYXBwbGljYXRpb25JZCxcbiAgICBFbmRwb2ludElkOiBlbmRwb2ludElkLFxuICAgIEVuZHBvaW50UmVxdWVzdDogZW5kcG9pbnRSZXF1ZXN0XG4gIH0pXG5cbiAgY29uc29sZS5sb2coXCJQaW5wb2ludCB1cGRhdGVFbmRwb2ludENvbW1hbmQgaXMgOlwiICsgSlNPTi5zdHJpbmdpZnkodXBkYXRlRW5kcG9pbnRDb21tYW5kKSlcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcGlucG9pbnRDbGllbnQuc2VuZCh1cGRhdGVFbmRwb2ludENvbW1hbmQpXG4gICAgY29uc29sZS5sb2coXCJFbmRwb2ludCBjcmVhdGVkL3VwZGF0ZWQ6XCIsIHJlc3BvbnNlKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjcmVhdGluZy91cGRhdGluZyBlbmRwb2ludDpcIiwgZXJyb3IpXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufVxuXG5cblxuIl19