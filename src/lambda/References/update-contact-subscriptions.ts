import AWS = require('aws-sdk')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as Constants from '../../utils/constants'
import * as contactApi from '../../api/user'

AWS.config.update({ region: Constants.AWS_REGION })

export async function updateContactSubscriptionsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    },
    isBase64Encoded: false,
    body: ''
  }

  try {

    const eventBody = JSON.parse(JSON.stringify(event || '{}'))
    console.log("To be updated event data ", eventBody)

    // Extract listId from the path parameters.
    const listId = event.queryStringParameters?.listId
    console.log("listId", listId)

    // Check if the listId is valid (you can implement your validation logic).
    if (!listId || typeof listId !== 'string') {
      response.body = "Invalid listId format"
      response.statusCode = Constants.INTERNAL_ERROR
      return response
    }

    const requestBody = JSON.parse(event.body || '{}')
    console.log("requestBody", requestBody)

    // Check if the payload has the required email field.
    if (
      (!requestBody.email || typeof requestBody.email !== 'string') &&
      (!requestBody.contactId || typeof requestBody.contactId !== 'string')
    ) {
      response.body = "Invalid request format"
      response.statusCode = Constants.INTERNAL_ERROR
      return response
    }

    let searchKey = {
      key: '',
      type: ''
    }

    if (requestBody.email) {
      searchKey.key = requestBody.email
      searchKey.type = "sort-key"

      const emailValidationError = contactApi.validateEmail(requestBody.email)
      if (emailValidationError.length > 0) {
        response.body = "Invalid email format"
        response.statusCode = Constants.INTERNAL_ERROR
        return response
      }

    } else if (requestBody.contactId) {
      searchKey.key = requestBody.contactId
      searchKey.type = "partition-key"

      if (typeof requestBody.contactId !== 'string') {
        response.body = "Invalid contact ID criteria"
        response.statusCode = Constants.INTERNAL_ERROR
        return response
      }
    }

    const httpMethod = event.httpMethod
    let updateResponse
    if (httpMethod === Constants.POST) {
      updateResponse = await contactApi.addContactSubscriptions(searchKey, listId)
      console.log("Contact updated", updateResponse)
      response.body = updateResponse.body
      response.statusCode = updateResponse.statusCode
    } else if (httpMethod === Constants.DELETE) {
      updateResponse = await contactApi.deleteContactSubscriptions(searchKey, listId)
      console.log("Contact updated", updateResponse)
      response.body = updateResponse.body
      response.statusCode = updateResponse.statusCode
    } else {
      response.body = "Invalid request"
      response.statusCode = Constants.INTERNAL_ERROR
      return response
    }

  } catch (error) {
    if (error instanceof Error) {
      response.body = error.message
      response.statusCode = Constants.ERROR
    }
  }

  console.log("Response from update Lambda", JSON.stringify(response))
  return response

}