import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UserType } from '../utils/user'
import { readUserFromEvent } from '../index'
import { v4 as uuidv4 } from 'uuid'

import * as Constants from '../utils/constants'
import * as contactApi from '../api/user'
import * as journalApi from '../api/journal'


import AWS = require('aws-sdk')

AWS.config.update({ region: Constants.AWS_REGION })

export async function getJournalEntryHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  console.log("Event Starting")

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
  const bodyData = event.body || '{}'

  console.log("Event Body", bodyData)

  // Extract user details from the path parameters.
  const email = event.queryStringParameters?.email


  if (!email) {
    response.body = "Validation Error - User missing required field email"
    response.statusCode = Constants.ERROR
    console.log("Response from create Lambda: 1 ", JSON.stringify(response))
    return response
  }

  
  var entries = await journalApi.retrieveEntryByEmail(email)

  var createdUser;
  if (entries && entries.length > 0) {
    console.log("Entries Fetched ", JSON.stringify(entries))

    // Beautify the JSON string with indentation (2 spaces)
    const beautifiedBody = JSON.stringify(entries, null, 2)
    response.body = beautifiedBody
  }
  console.log("Response from fetch journals Lambda", JSON.stringify(response))
  return response
}