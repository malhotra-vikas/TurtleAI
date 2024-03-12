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
exports.adminAlertSnsHandler = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../../utils/constants"));
const contactApi = __importStar(require("../../api/user"));
AWS.config.update({ region: Constants.AWS_REGION });
const adminAlertSnsHandler = async (event) => {
    const ses = new AWS.SES({ apiVersion: '2010-12-01' });
    console.log("Received event:", JSON.stringify(event, null, 2));
    // Loop through each record in the event
    for (const record of event.Records) {
        // Get the SNS message
        const sns = record.Sns;
        const message = sns.Message;
        const contactId = message;
        let contactEmail;
        let contactPhone;
        let tags;
        let firstName;
        let lastName;
        let contactMessage;
        const contacts = await contactApi.retrieveContactById(contactId);
        if (contacts) {
            const contact = contacts[0];
            firstName = contact['firstName'];
            lastName = contact['lastName'];
            contactEmail = contact['email'];
            contactPhone = contact['phone'];
            tags = contact['tags'];
            contactMessage = contact['message'];
        }
        // Read email addresses from environment variable and split into an array
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['malhotra.vikas@gmail.com>'];
        console.log("ContactId:", contactId);
        console.log("Message:", contactMessage);
        for (const email of adminEmails) {
            // Send an email using AWS SES
            const emailHtmlContent = createEmailHtml(firstName, lastName, contactEmail, contactPhone, contactId, tags, contactMessage);
            const params = {
                Source: 'malhotra.vikas@gmail.com',
                Destination: {
                    ToAddresses: [email]
                },
                Message: {
                    Subject: {
                        Data: "Alert: Contact Created"
                    },
                    Body: {
                        Html: {
                            Data: emailHtmlContent
                        }
                    }
                }
            };
            console.log("Attempting to send email");
            try {
                const emailResponse = await ses.sendEmail(params).promise();
                console.log("Email sent! To: " + email + " The Contact ID is: ", contactId);
            }
            catch (error) {
                console.error("Error sending email:", error);
            }
        }
    }
};
exports.adminAlertSnsHandler = adminAlertSnsHandler;
function createEmailHtml(firstName, lastName, contactEmail, contactPhone, contactId, tags, contactMessage) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; }
                .content { background: #f8f8f8; padding: 20px; }
                .footer { text-align: left; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <h1>New Contact Alert</h1>
                    <p>A new contact has been created:</p>
                    <p><strong>Name:</strong> ${firstName ? firstName : 'n/a'} ${lastName ? lastName : ''}</p>
                    <p><strong>Email:</strong> ${contactEmail}</p>
                    <p><strong>Phone:</strong> ${contactPhone ? contactPhone : 'n/a'}</p>
                    <p><strong>Contact ID:</strong> ${contactId}</p>
                    <p><strong>Tags:</strong> ${tags ? tags : 'n/a'}</p>
                    <p><strong>Message:</strong>  ${contactMessage ? contactMessage : 'n/a'}</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4tYWxlcnQtc25zLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGFtYmRhL1JlZmVyZW5jZXMvYWRtaW4tYWxlcnQtc25zLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFL0IsaUVBQWtEO0FBQ2xELDJEQUE0QztBQUU1QyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtBQUU1QyxNQUFNLG9CQUFvQixHQUFHLEtBQUssRUFBRSxLQUFlLEVBQWlCLEVBQUU7SUFDM0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUE7SUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUU5RCx3Q0FBd0M7SUFDeEMsS0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQ2xDLHNCQUFzQjtRQUN0QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFBO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUE7UUFFM0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFBO1FBQ3pCLElBQUksWUFBWSxDQUFBO1FBQ2hCLElBQUksWUFBWSxDQUFBO1FBQ2hCLElBQUksSUFBSSxDQUFBO1FBQ1IsSUFBSSxTQUFTLENBQUE7UUFDYixJQUFJLFFBQVEsQ0FBQTtRQUNaLElBQUksY0FBYyxDQUFBO1FBRWxCLE1BQU0sUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FB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LXNkaycpXG5pbXBvcnQgeyBTTlNFdmVudCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnRzJ1xuaW1wb3J0ICogYXMgY29udGFjdEFwaSBmcm9tICcuLi8uLi9hcGkvdXNlcidcblxuQVdTLmNvbmZpZy51cGRhdGUoeyByZWdpb246IENvbnN0YW50cy5BV1NfUkVHSU9OIH0pXG5cbmV4cG9ydCBjb25zdCBhZG1pbkFsZXJ0U25zSGFuZGxlciA9IGFzeW5jIChldmVudDogU05TRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3Qgc2VzID0gbmV3IEFXUy5TRVMoeyBhcGlWZXJzaW9uOiAnMjAxMC0xMi0wMScgfSlcbiAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBldmVudDpcIiwgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDIpKVxuXG4gIC8vIExvb3AgdGhyb3VnaCBlYWNoIHJlY29yZCBpbiB0aGUgZXZlbnRcbiAgZm9yIChjb25zdCByZWNvcmQgb2YgZXZlbnQuUmVjb3Jkcykge1xuICAgIC8vIEdldCB0aGUgU05TIG1lc3NhZ2VcbiAgICBjb25zdCBzbnMgPSByZWNvcmQuU25zXG4gICAgY29uc3QgbWVzc2FnZSA9IHNucy5NZXNzYWdlXG5cbiAgICBjb25zdCBjb250YWN0SWQgPSBtZXNzYWdlXG4gICAgbGV0IGNvbnRhY3RFbWFpbFxuICAgIGxldCBjb250YWN0UGhvbmVcbiAgICBsZXQgdGFnc1xuICAgIGxldCBmaXJzdE5hbWVcbiAgICBsZXQgbGFzdE5hbWVcbiAgICBsZXQgY29udGFjdE1lc3NhZ2VcblxuICAgIGNvbnN0IGNvbnRhY3RzID0gYXdhaXQgY29udGFjdEFwaS5yZXRyaWV2ZUNvbnRhY3RCeUlkKGNvbnRhY3RJZClcbiAgICBpZiAoY29udGFjdHMpIHtcbiAgICAgIGNvbnN0IGNvbnRhY3QgPSBjb250YWN0c1swXVxuICAgICAgZmlyc3ROYW1lID0gY29udGFjdFsnZmlyc3ROYW1lJ11cbiAgICAgIGxhc3ROYW1lID0gY29udGFjdFsnbGFzdE5hbWUnXVxuICAgICAgY29udGFjdEVtYWlsID0gY29udGFjdFsnZW1haWwnXVxuICAgICAgY29udGFjdFBob25lID0gY29udGFjdFsncGhvbmUnXVxuICAgICAgdGFncyA9IGNvbnRhY3RbJ3RhZ3MnXVxuICAgICAgY29udGFjdE1lc3NhZ2UgPSBjb250YWN0WydtZXNzYWdlJ11cbiAgICB9XG5cbiAgICAvLyBSZWFkIGVtYWlsIGFkZHJlc3NlcyBmcm9tIGVudmlyb25tZW50IHZhcmlhYmxlIGFuZCBzcGxpdCBpbnRvIGFuIGFycmF5XG4gICAgY29uc3QgYWRtaW5FbWFpbHMgPSBwcm9jZXNzLmVudi5BRE1JTl9FTUFJTFMgPyBwcm9jZXNzLmVudi5BRE1JTl9FTUFJTFMuc3BsaXQoJywnKSA6IFsnbWFsaG90cmEudmlrYXNAZ21haWwuY29tPiddXG5cbiAgICBjb25zb2xlLmxvZyhcIkNvbnRhY3RJZDpcIiwgY29udGFjdElkKVxuICAgIGNvbnNvbGUubG9nKFwiTWVzc2FnZTpcIiwgY29udGFjdE1lc3NhZ2UpXG5cbiAgICBmb3IgKGNvbnN0IGVtYWlsIG9mIGFkbWluRW1haWxzKSB7XG4gICAgICAvLyBTZW5kIGFuIGVtYWlsIHVzaW5nIEFXUyBTRVNcbiAgICAgIGNvbnN0IGVtYWlsSHRtbENvbnRlbnQgPSBjcmVhdGVFbWFpbEh0bWwoZmlyc3ROYW1lLCBsYXN0TmFtZSwgY29udGFjdEVtYWlsLCBjb250YWN0UGhvbmUsIGNvbnRhY3RJZCwgdGFncywgY29udGFjdE1lc3NhZ2UpXG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgU291cmNlOiAnbWFsaG90cmEudmlrYXNAZ21haWwuY29tJyxcbiAgICAgICAgRGVzdGluYXRpb246IHtcbiAgICAgICAgICBUb0FkZHJlc3NlczogW2VtYWlsXVxuICAgICAgICB9LFxuICAgICAgICBNZXNzYWdlOiB7XG4gICAgICAgICAgU3ViamVjdDoge1xuICAgICAgICAgICAgRGF0YTogXCJBbGVydDogQ29udGFjdCBDcmVhdGVkXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIEJvZHk6IHtcbiAgICAgICAgICAgIEh0bWw6IHtcbiAgICAgICAgICAgICAgRGF0YTogZW1haWxIdG1sQ29udGVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gc2VuZCBlbWFpbFwiKVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZW1haWxSZXNwb25zZSA9IGF3YWl0IHNlcy5zZW5kRW1haWwocGFyYW1zKS5wcm9taXNlKClcbiAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBzZW50ISBUbzogXCIgKyBlbWFpbCArIFwiIFRoZSBDb250YWN0IElEIGlzOiBcIiwgY29udGFjdElkKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNlbmRpbmcgZW1haWw6XCIsIGVycm9yKVxuICAgICAgfVxuXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtYWlsSHRtbChmaXJzdE5hbWU6IHN0cmluZywgbGFzdE5hbWU6IHN0cmluZywgY29udGFjdEVtYWlsOiBzdHJpbmcsIGNvbnRhY3RQaG9uZTogc3RyaW5nLCBjb250YWN0SWQ6IHN0cmluZywgdGFnczogc3RyaW5nLCBjb250YWN0TWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBcbiAgICAgICAgPCFET0NUWVBFIGh0bWw+XG4gICAgICAgIDxodG1sPlxuICAgICAgICA8aGVhZD5cbiAgICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgICAgICBib2R5IHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyB9XG4gICAgICAgICAgICAgICAgLmNvbnRhaW5lciB7IHdpZHRoOiAxMDAlOyBtYXgtd2lkdGg6IDYwMHB4OyBtYXJnaW46IDAgYXV0bzsgfVxuICAgICAgICAgICAgICAgIC5jb250ZW50IHsgYmFja2dyb3VuZDogI2Y4ZjhmODsgcGFkZGluZzogMjBweDsgfVxuICAgICAgICAgICAgICAgIC5mb290ZXIgeyB0ZXh0LWFsaWduOiBsZWZ0OyBmb250LXNpemU6IDEycHg7IGNvbG9yOiAjNjY2OyB9XG4gICAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICA8L2hlYWQ+XG4gICAgICAgIDxib2R5PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMT5OZXcgQ29udGFjdCBBbGVydDwvaDE+XG4gICAgICAgICAgICAgICAgICAgIDxwPkEgbmV3IGNvbnRhY3QgaGFzIGJlZW4gY3JlYXRlZDo8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+TmFtZTo8L3N0cm9uZz4gJHtmaXJzdE5hbWUgPyBmaXJzdE5hbWUgOiAnbi9hJ30gJHtsYXN0TmFtZSA/IGxhc3ROYW1lIDogJyd9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3Ryb25nPkVtYWlsOjwvc3Ryb25nPiAke2NvbnRhY3RFbWFpbH08L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+UGhvbmU6PC9zdHJvbmc+ICR7Y29udGFjdFBob25lID8gY29udGFjdFBob25lIDogJ24vYSd9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3Ryb25nPkNvbnRhY3QgSUQ6PC9zdHJvbmc+ICR7Y29udGFjdElkfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5UYWdzOjwvc3Ryb25nPiAke3RhZ3MgPyB0YWdzIDogJ24vYSd9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3Ryb25nPk1lc3NhZ2U6PC9zdHJvbmc+ICAke2NvbnRhY3RNZXNzYWdlID8gY29udGFjdE1lc3NhZ2UgOiAnbi9hJ308L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICA8cD5UaGlzIGlzIGFuIGF1dG9tYXRlZCBtZXNzYWdlLiBQbGVhc2UgZG8gbm90IHJlcGx5IHRvIHRoaXMgZW1haWwuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYm9keT5cbiAgICAgICAgPC9odG1sPlxuICAgIGBcbn1cbiJdfQ==