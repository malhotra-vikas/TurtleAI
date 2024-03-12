import AWS = require('aws-sdk')

import * as Constants from '../utils/constants'

AWS.config.update({ region: Constants.AWS_REGION })
const region = Constants.AWS_REGION

import { EndpointRequest, PinpointClient, UpdateEndpointCommand } from "@aws-sdk/client-pinpoint"
const pinpointClient = new PinpointClient({ region: region })
const applicationId = Constants.PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION

let endpointRequest: EndpointRequest = {
  ChannelType: "EMAIL",
  Address: '',
  OptOut: "NONE", // 'ALL', 'NONE', or 'SOME'
  Attributes: {
    // Example attributes
    Interests: []
  }
}

export async function createPinpointEndpoint(contactId: string, interests: [string], email: string) {

  const endpointId = contactId

  if (!endpointId) {
    console.error("EndpointId is undefined")

    throw new Error("EndpointId is undefined")
  }

  if (!endpointRequest.Attributes) {
    endpointRequest.Attributes = {}
  }


  if (interests && interests.length > 0) {
    endpointRequest.Attributes.Interests = interests
  }

  endpointRequest.Address = email

  console.log("Pinpoint endpointRequest is :" + JSON.stringify(endpointRequest))

  const updateEndpointCommand = new UpdateEndpointCommand({
    ApplicationId: applicationId,
    EndpointId: endpointId,
    EndpointRequest: endpointRequest
  })

  console.log("Pinpoint updateEndpointCommand is :" + JSON.stringify(updateEndpointCommand))

  try {
    const response = await pinpointClient.send(updateEndpointCommand)
    console.log("Endpoint created/updated:", response)
  } catch (error) {
    console.error("Error creating/updating endpoint:", error)
    throw error
  }
}



