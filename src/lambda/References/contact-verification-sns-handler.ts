import AWS = require('aws-sdk')
import { SNSMessage, SNSEvent } from 'aws-lambda'
import * as Constants from '../../utils/constants'

AWS.config.update({ region: Constants.AWS_REGION })

export const contactVerificationSnsHandler = async (event: SNSEvent): Promise<void> => {
  // Loop through each record in the event
  for (const record of event.Records) {
    const snsMessage: SNSMessage = record.Sns
    console.log(`Received SNS message: ${snsMessage.Message}`)

    // Process the SNS message
    // For now, we'll just log it. We will implement business logic soon
    console.log('Hello! A new SNS event has arrived:', snsMessage)
  }
}
