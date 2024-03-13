import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UserType } from '../utils/user'
import { readUserFromEvent } from '../index'
import { v4 as uuidv4 } from 'uuid'

import * as Constants from '../utils/constants'
import * as journalApi from '../api/journal'
import * as pinpointApi from '../api/pinpoint'

import AWS = require('aws-sdk')

AWS.config.update({ region: Constants.AWS_REGION })

export async function createJournalEntryHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  console.log("Event Starting")

  var createdUser;

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    },
    isBase64Encoded: false,
    body: ''
  }

  console.log("Event body is" + JSON.stringify(event.body))

  //const bodyData = JSON.parse(JSON.stringify(event.body || '{}'))
// Parse the JSON string to an object
const bodyData = JSON.parse(event.body || '{}');

  console.log("Event Body", bodyData)

  // Extract user details from the path parameters.
  const userEmail = bodyData.userEmail;
  const entryType = bodyData.entryType;
  const notes = bodyData.notes;
  const employeeId = bodyData.employeeId || '';
  const projectId = bodyData.projectId || '';
  const taskId = bodyData.taskId || '';
  const todayDate = new Date();
  const timeStamp = todayDate.getTime();

  if (!userEmail) {
    response.body = "Validation Error - User missing required field email"
    response.statusCode = Constants.ERROR
    console.log("Response from create Lambda: 1 ", JSON.stringify(response))
    return response
  }

  if (!entryType) {
    response.body = "Validation Error - User missing required field Entry Type"
    response.statusCode = Constants.ERROR
    console.log("Response from create Lambda: 1 ", JSON.stringify(response))
    return response
  }
  if (!notes) {
    response.body = "Validation Error - User missing required field notes"
    response.statusCode = Constants.ERROR
    console.log("Response from create Lambda: 1 ", JSON.stringify(response))
    return response
  }

  var entry = await journalApi.createEntry(userEmail, timeStamp, entryType, employeeId, projectId, taskId, notes)
  console.log("Journal Entry Created", JSON.stringify(entry))

  var createdEntry;
  if (response.statusCode = 200) {

    // Query for the contact that was successfully created and return that in response
    createdEntry = await journalApi.retrieveEntryByTimestamp(userEmail, timeStamp)
    console.log("createdEntry", createdEntry)

    // Beautify the JSON string with indentation (2 spaces)
    const beautifiedBody = JSON.stringify(createdEntry, null, 2)
    response.body = beautifiedBody
  }
  console.log("Response from create Lambda", JSON.stringify(response))
  return response
}