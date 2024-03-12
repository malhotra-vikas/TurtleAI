import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UserType } from '../utils/user'
import { readUserFromEvent } from '../index'
import { v4 as uuidv4 } from 'uuid'

import * as Constants from '../utils/constants'
import * as contactApi from '../api/user'
import * as pinpointApi from '../api/pinpoint'

import AWS = require('aws-sdk')

AWS.config.update({ region: Constants.AWS_REGION })

export async function createUserHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

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
  const bodyData = event.body || '{}'


  console.log("Event Body", bodyData)

  // Extract user details from the path parameters.
  const userEmail = event.queryStringParameters?.userEmail
  const name = event.queryStringParameters?.name


  if (!userEmail) {
    response.body = "Validation Error - User missing required field email"
    response.statusCode = Constants.ERROR
    console.log("Response from create Lambda: 1 ", JSON.stringify(response))
    return response
  }


  if (!name) {
    response.body = "Validation Error - User missing required field name"
    response.statusCode = Constants.ERROR
    console.log("Response from create Lambda: 1 ", JSON.stringify(response))
    return response
  }

  var user = await contactApi.createUser(userEmail, name)
  console.log("Contact Created", JSON.stringify(user))

  var createdUser;
  if (response.statusCode = 200) {

    // Query for the contact that was successfully created and return that in response
    createdUser = await contactApi.retrieveUserByEmail(userEmail)
    console.log("createdContact", createdUser)

    // Beautify the JSON string with indentation (2 spaces)
    const beautifiedBody = JSON.stringify(createdUser, null, 2)
    response.body = beautifiedBody
  }
  console.log("Response from create Lambda", JSON.stringify(response))
  return response
}