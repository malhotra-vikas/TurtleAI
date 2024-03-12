import AWS = require('aws-sdk')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UserType } from '../../utils/user'
import { readUserFromEvent } from '../../index'
import * as Constants from '../../utils/constants'

AWS.config.update({ region: Constants.AWS_REGION })

export async function emailMessagingHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  console.log("Event Starting")
  const region = Constants.AWS_REGION

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    },
    isBase64Encoded: false,
    body: ''
  }

  const bodyData = JSON.parse(JSON.stringify(event.body || '{}'))

  const user: UserType = await readUserFromEvent(bodyData)

  console.log("User Data", user)

  console.log("Response from create Lambda", JSON.stringify(response))
  return response
}



