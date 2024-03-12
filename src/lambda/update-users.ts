import AWS = require('aws-sdk')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UserType } from '../utils/user'
import { readUserFromEvent, readUserFromUpdateEvent } from '../index'
import * as Constants from '../utils/constants'
import * as contactApi from '../api/user'

AWS.config.update({ region: Constants.AWS_REGION })
const dynamoDB = new AWS.DynamoDB.DocumentClient()

export async function updateContactHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  console.log("Event starting")
  const region = Constants.AWS_REGION
  var updatedContact

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    },
    isBase64Encoded: false,
    body: ''
  }
  // console.log("Event Body is " + JSON.stringify(event.body))

  // Extract email from the path parameters.
  const contactId_ToFetchAndUpdate = event.queryStringParameters?.contactId
  console.log("contactId", contactId_ToFetchAndUpdate)

  // Check if the listId is valid (you can implement your validation logic).
  if (!contactId_ToFetchAndUpdate) {
    response.body = "Missing search criteria"
    response.statusCode = Constants.INTERNAL_ERROR
    console.log("Response 3:", response)

    return response
  }

  if (typeof contactId_ToFetchAndUpdate !== 'string') {
    response.body = "Invalid search criteria"
    response.statusCode = Constants.INTERNAL_ERROR
    console.log("Response 4:", response)

    return response
  }

  console.log("Running fetch and updates for contactId ", contactId_ToFetchAndUpdate)

  const eventBodyData = event.body || '{}'

  console.log("To be updated body data", eventBodyData)

  const userFromEventBody: UserType = await readUserFromEvent(eventBodyData)
  userFromEventBody.contactId = contactId_ToFetchAndUpdate

  console.log("To be updated user data is", userFromEventBody)

  if (userFromEventBody.phone) {
    const phoneValidationError = contactApi.validatePhone(userFromEventBody.phone as string)
    if (phoneValidationError.length > 0) {
      response.body = phoneValidationError[0]
      response.statusCode = Constants.INTERNAL_ERROR
      console.log("Response 2:", response)

      return response
    }
  }

  var existingUser: UserType = { email: "x@x.com", contactId: "x" }
  var updateResponse

  const currentContacts = await contactApi.retrieveContactById(contactId_ToFetchAndUpdate)
  var currentContact
  if (currentContacts) {
    currentContact = currentContacts[0]

    if (!currentContact) {
      response.body = "No contact found by that ID"
      response.statusCode = Constants.DOES_NOT_EXIST
      return response
    }
    existingUser.firstName = currentContact['firstName']
    existingUser.lastName = currentContact['lastName']
    existingUser.email = currentContact['email']
    existingUser.phone = currentContact['phone']
    existingUser.lists = currentContact['lists']
    existingUser.tags = currentContact['tags']
    existingUser.customFields = currentContact['customFields']
    existingUser.owner = currentContact['owner']
    existingUser.contactId = contactId_ToFetchAndUpdate
  }
  console.log("To be compared and updated - current user in DB", existingUser)

  //currentUser = await readUserFromUpdateEvent(JSON.stringify(currentContact))

  //console.log("currentUser  ", currentUser)
  updateResponse = await contactApi.updateContactById(contactId_ToFetchAndUpdate, existingUser, userFromEventBody)
  console.log("Contact updated", updateResponse)

  if (updateResponse.statusCode == Constants.SUCCESS) {
    // Query for the contact that was successfully updated and return that in response
    updatedContact = await contactApi.retrieveContactById(contactId_ToFetchAndUpdate)
    console.log("Updated contact", updatedContact)

    // Beautify the JSON string with indentation (2 spaces)
    const beautifiedBody = JSON.stringify(updatedContact, null, 2)
    response.body = beautifiedBody

  } else {
    response.body = updateResponse.body
    response.statusCode = updateResponse.statusCode
  }

  console.log("Response from update Lambda", JSON.stringify(response))
  return response
}


