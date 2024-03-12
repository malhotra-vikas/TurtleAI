import { S3Event, Context } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { Readable } from 'stream'
import csv from 'csv-parser'

import { UserType } from '../../utils/user'

import { v4 as uuidv4 } from 'uuid'
import * as Constants from '../../utils/constants'
import * as contactApi from '../../api/user'
import * as pinpointApi from '../../api/pinpoint'

import AWS = require('aws-sdk')
const s3 = new S3()

AWS.config.update({ region: 'us-east-1' }) // Set your desired region

AWS.config.update({ region: Constants.AWS_REGION })

function processCustomFields(fields: string): string {
  const fieldPairs = fields.split('|')
  const customFields: Record<string, string> = {}
  fieldPairs.forEach(pair => {
    const [key, value] = pair.split('=')
    customFields[key] = value
  })
  return JSON.stringify(customFields)
}

export async function bulkCreateContactHandler(event: S3Event, context: Context): Promise<string> {

  console.log("Received event:", JSON.stringify(event, null, 2))

  var createdContact

  // Default to validation of email uniqueness
  let validateEmailUponContactCreation = true

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    },
    isBase64Encoded: false,
    body: ''
  }

  var bucketName = ''
  var fileKey = ''

  for (const record of event.Records) {
    bucketName = record.s3.bucket.name
    fileKey = record.s3.object.key
    // only one file is passed at a time to be processed
  }

  if (!bucketName || bucketName === '' || !fileKey || fileKey === '') {
    throw 'No fileKey or bucketName found in the request'
  }

  console.log("File to be processed is  ", fileKey)
  console.log("Bucket to be processed at S3 bucket  ", bucketName)

  // May be add counts of success and failing uploads later and send that back to the user
  let successfulUploads = 0
  let failureUploads = 0

  try {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
    }

    const data = await s3.getObject(params).promise()
    let records: UserType[] = []

    // Check if data.Body is not undefined
    if (data.Body) {
      const stream = Readable.from(data.Body.toString('utf-8'))
      for await (const record of stream.pipe(csv())) {

        let user: UserType = {
          email: record.email,
          firstName: record.firstName,
          lastName: record.lastName,
          phone: record.phone,
          lists: record.lists ? record.lists.split('|') : undefined,
          tags: record.tags ? record.tags.split('|') : undefined,
          verified: record.verified,
          customFields: JSON.parse(processCustomFields(record.customFields)),
          owner: record.owner,
          message: record.message
        }

        records.push(user)
        console.log('CSV Records:', user)
      }

      for (const user of records) {
        console.log('Processing user:', user)

        if (!user.email) {
          response.body = "Validation Error - User missing required field email"
          console.log(response.body)
          failureUploads = failureUploads + 1
          continue
        }


        const emailValidationError = contactApi.validateEmail(user.email)
        if (emailValidationError.length > 0) {
          response.body = emailValidationError[0]
          console.log(response.body)
          failureUploads = failureUploads + 1
          continue
        }

        const phoneValidationError = contactApi.validatePhone(user.phone as string)
        if (phoneValidationError.length > 0) {
          response.body = phoneValidationError[0]
          console.log(response.body)
          failureUploads = failureUploads + 1
          continue
        }

        const emailExistsValidationErrors = await contactApi.validateDuplicateUser(user)

        // Validation check and send error response where the duplicate user is detected
        if (validateEmailUponContactCreation && emailExistsValidationErrors.length > 0) {
          response.body = emailExistsValidationErrors[0]
          console.log(response.body)
          failureUploads = failureUploads + 1
          continue
        }

        const contactId = uuidv4()
        var contact = await contactApi.createContact(user, null, contactId)
        console.log("Contact Created ", JSON.stringify(contact))

        if (response.statusCode = 200) {
          successfulUploads = successfulUploads + 1

          // Query for the contact that was successfully created and return that in response
          createdContact = await contactApi.retrieveContactById(contactId)
          console.log("createdContact  ", createdContact)

          if (createdContact && createdContact.length > 0) {
            console.log("createdContact ID ", createdContact[0].contactId)

            // If the contact was successfully saved in the DB and alertAdmin is true, send a event to admin alert SnSQueue

            // The SNS queue could come from env variable later
            await contactApi.alertAdmin(contactId)

            // If the contact was successfully saved in the DB and autoVerify is false, send a event to verification SnSQueue
            await contactApi.verifyUser(contactId)

            // If the contact was successfully saved in the DB, also add a record in ContactVerification Table
            const contactVerificationId = uuidv4()
            contactApi.persistContactVerification(contactId, contactVerificationId)

            // Create a Pinpoint Endpoint for this user
            pinpointApi.createPinpointEndpoint(createdContact[0].contactId, createdContact[0].tags, createdContact[0].email)
          }

          // Beautify the JSON string with indentation (2 spaces)
          const beautifiedBody = JSON.stringify(createdContact, null, 2)
          response.body = beautifiedBody
        }
      }
    } else {
      console.error('No data found in the S3 object.')
      return "No data found in the S3 object."
    }
  } catch (error) {
    console.error(`Error processing file ${fileKey} from bucket ${bucketName}: ${error}`)
    throw error
  }
  let returnStatus = "Successfully created " + successfulUploads + " contacts and validation failed on " + failureUploads + " contacts."
  console.log(returnStatus)
  return returnStatus
}



