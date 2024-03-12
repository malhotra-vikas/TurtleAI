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
exports.contactVerificationSnsHandler = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../../utils/constants"));
AWS.config.update({ region: Constants.AWS_REGION });
const contactVerificationSnsHandler = async (event) => {
    // Loop through each record in the event
    for (const record of event.Records) {
        const snsMessage = record.Sns;
        console.log(`Received SNS message: ${snsMessage.Message}`);
        // Process the SNS message
        // For now, we'll just log it. We will implement business logic soon
        console.log('Hello! A new SNS event has arrived:', snsMessage);
    }
};
exports.contactVerificationSnsHandler = contactVerificationSnsHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFjdC12ZXJpZmljYXRpb24tc25zLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGFtYmRhL1JlZmVyZW5jZXMvY29udGFjdC12ZXJpZmljYXRpb24tc25zLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFL0IsaUVBQWtEO0FBRWxELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO0FBRTVDLE1BQU0sNkJBQTZCLEdBQUcsS0FBSyxFQUFFLEtBQWUsRUFBaUIsRUFBRTtJQUNwRix3Q0FBd0M7SUFDeEMsS0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQ2xDLE1BQU0sVUFBVSxHQUFlLE1BQU0sQ0FBQyxHQUFHLENBQUE7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFFMUQsMEJBQTBCO1FBQzFCLG9FQUFvRTtRQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQy9EO0FBQ0gsQ0FBQyxDQUFBO0FBVlksUUFBQSw2QkFBNkIsaUNBVXpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKVxuaW1wb3J0IHsgU05TTWVzc2FnZSwgU05TRXZlbnQgfSBmcm9tICdhd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4uLy4uL3V0aWxzL2NvbnN0YW50cydcblxuQVdTLmNvbmZpZy51cGRhdGUoeyByZWdpb246IENvbnN0YW50cy5BV1NfUkVHSU9OIH0pXG5cbmV4cG9ydCBjb25zdCBjb250YWN0VmVyaWZpY2F0aW9uU25zSGFuZGxlciA9IGFzeW5jIChldmVudDogU05TRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgLy8gTG9vcCB0aHJvdWdoIGVhY2ggcmVjb3JkIGluIHRoZSBldmVudFxuICBmb3IgKGNvbnN0IHJlY29yZCBvZiBldmVudC5SZWNvcmRzKSB7XG4gICAgY29uc3Qgc25zTWVzc2FnZTogU05TTWVzc2FnZSA9IHJlY29yZC5TbnNcbiAgICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgU05TIG1lc3NhZ2U6ICR7c25zTWVzc2FnZS5NZXNzYWdlfWApXG5cbiAgICAvLyBQcm9jZXNzIHRoZSBTTlMgbWVzc2FnZVxuICAgIC8vIEZvciBub3csIHdlJ2xsIGp1c3QgbG9nIGl0LiBXZSB3aWxsIGltcGxlbWVudCBidXNpbmVzcyBsb2dpYyBzb29uXG4gICAgY29uc29sZS5sb2coJ0hlbGxvISBBIG5ldyBTTlMgZXZlbnQgaGFzIGFycml2ZWQ6Jywgc25zTWVzc2FnZSlcbiAgfVxufVxuIl19