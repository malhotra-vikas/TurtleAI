import AWS = require('aws-sdk')
import { SNSEvent } from 'aws-lambda'
import * as Constants from '../../utils/constants'
import * as contactApi from '../../api/user'

AWS.config.update({ region: Constants.AWS_REGION })

export const adminAlertSnsHandler = async (event: SNSEvent): Promise<void> => {
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  console.log("Received event:", JSON.stringify(event, null, 2))

  // Loop through each record in the event
  for (const record of event.Records) {
    // Get the SNS message
    const sns = record.Sns
    const message = sns.Message

    const contactId = message
    let contactEmail
    let contactPhone
    let tags
    let firstName
    let lastName
    let contactMessage

    const contacts = await contactApi.retrieveContactById(contactId)
    if (contacts) {
      const contact = contacts[0]
      firstName = contact['firstName']
      lastName = contact['lastName']
      contactEmail = contact['email']
      contactPhone = contact['phone']
      tags = contact['tags']
      contactMessage = contact['message']
    }

    // Read email addresses from environment variable and split into an array
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['malhotra.vikas@gmail.com>']

    console.log("ContactId:", contactId)
    console.log("Message:", contactMessage)

    for (const email of adminEmails) {
      // Send an email using AWS SES
      const emailHtmlContent = createEmailHtml(firstName, lastName, contactEmail, contactPhone, contactId, tags, contactMessage)

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
      }

      console.log("Attempting to send email")
      try {
        const emailResponse = await ses.sendEmail(params).promise()
        console.log("Email sent! To: " + email + " The Contact ID is: ", contactId)
      } catch (error) {
        console.error("Error sending email:", error)
      }

    }
  }
}

function createEmailHtml(firstName: string, lastName: string, contactEmail: string, contactPhone: string, contactId: string, tags: string, contactMessage: string): string {
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
    `
}
