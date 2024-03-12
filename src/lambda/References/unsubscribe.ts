import AWS = require('aws-sdk')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as Constants from '../../utils/constants'
import * as contactApi from '../../api/user'

AWS.config.update({ region: Constants.AWS_REGION })

export async function unSubscribeHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

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
    console.log("To be Updated Event Data", eventBody)

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

      const emailExistsValidationErrors = await contactApi.validateExistingUser(requestBody.email)

      // Validation check and send error response where the existing user is not detected for this email
      if (emailExistsValidationErrors.length > 0) {
        response.body = emailExistsValidationErrors[0]
        response.statusCode = Constants.ERROR
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

      const contactIdExistsValidationErrors = await contactApi.validateExistingUserByContactId(requestBody.contactId)

      // Validation check and send error response where the existing user is not detected for this email
      if (contactIdExistsValidationErrors.length > 0) {
        response.body = contactIdExistsValidationErrors[0]
        response.statusCode = Constants.ERROR
        return response
      }
    }

    const httpMethod = event.httpMethod
    let updateResponse
    if (httpMethod === Constants.POST) {
      updateResponse = await contactApi.unsubscribeContactFromAllLists(searchKey)
      console.log("Contact updated ", updateResponse)
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

  console.log("Response from update Lambda ", JSON.stringify(response))
  return response

}