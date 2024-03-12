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
exports.emailMessagingHandler = void 0;
const AWS = require("aws-sdk");
const index_1 = require("../../index");
const Constants = __importStar(require("../../utils/constants"));
AWS.config.update({ region: Constants.AWS_REGION });
async function emailMessagingHandler(event) {
    console.log("Event Starting");
    const region = Constants.AWS_REGION;
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json'
        },
        isBase64Encoded: false,
        body: ''
    };
    const bodyData = JSON.parse(JSON.stringify(event.body || '{}'));
    const user = await (0, index_1.readUserFromEvent)(bodyData);
    console.log("User Data", user);
    console.log("Response from create Lambda", JSON.stringify(response));
    return response;
}
exports.emailMessagingHandler = emailMessagingHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtbWVzc2FnaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xhbWJkYS9SZWZlcmVuY2VzL2VtYWlsLW1lc3NhZ2luZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUcvQix1Q0FBK0M7QUFDL0MsaUVBQWtEO0FBRWxELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO0FBRTVDLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxLQUEyQjtJQUVyRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDN0IsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQTtJQUVuQyxJQUFJLFFBQVEsR0FBRztRQUNiLFVBQVUsRUFBRSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRztZQUNsQyxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO1FBQ0QsZUFBZSxFQUFFLEtBQUs7UUFDdEIsSUFBSSxFQUFFLEVBQUU7S0FDVCxDQUFBO0lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUUvRCxNQUFNLElBQUksR0FBYSxNQUFNLElBQUEseUJBQWlCLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFFeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFFOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDcEUsT0FBTyxRQUFRLENBQUE7QUFDakIsQ0FBQztBQXZCRCxzREF1QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlFdmVudCwgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSAnYXdzLWxhbWJkYSdcbmltcG9ydCB7IFVzZXJUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXNlcidcbmltcG9ydCB7IHJlYWRVc2VyRnJvbUV2ZW50IH0gZnJvbSAnLi4vLi4vaW5kZXgnXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnRzJ1xuXG5BV1MuY29uZmlnLnVwZGF0ZSh7IHJlZ2lvbjogQ29uc3RhbnRzLkFXU19SRUdJT04gfSlcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVtYWlsTWVzc2FnaW5nSGFuZGxlcihldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4ge1xuXG4gIGNvbnNvbGUubG9nKFwiRXZlbnQgU3RhcnRpbmdcIilcbiAgY29uc3QgcmVnaW9uID0gQ29uc3RhbnRzLkFXU19SRUdJT05cblxuICBsZXQgcmVzcG9uc2UgPSB7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfSxcbiAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgIGJvZHk6ICcnXG4gIH1cblxuICBjb25zdCBib2R5RGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZXZlbnQuYm9keSB8fCAne30nKSlcblxuICBjb25zdCB1c2VyOiBVc2VyVHlwZSA9IGF3YWl0IHJlYWRVc2VyRnJvbUV2ZW50KGJvZHlEYXRhKVxuXG4gIGNvbnNvbGUubG9nKFwiVXNlciBEYXRhXCIsIHVzZXIpXG5cbiAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIGNyZWF0ZSBMYW1iZGFcIiwgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKVxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxuXG5cbiJdfQ==