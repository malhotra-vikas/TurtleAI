import AWS = require('aws-sdk')
import { UserType } from "../utils/user"
import * as Constants from "../utils/constants"
import * as CustomLogger from "../utils/turtleai-logger"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

AWS.config.update({ region: Constants.AWS_REGION })
const dynamoDB = new AWS.DynamoDB.DocumentClient()

export async function createUser(userEmail: string, name: string) {

  var user = null
  const newUser = true

  console.log("User email", userEmail)
  console.log("User Name", name)

  // Add autoVerify and alertAdmin in case of a new Contact being created
  const params = {
    TableName: Constants.TEN_TEN_USERS_TABLE,
    Item: {
      email: userEmail,
      name: name
    },
    ReturnConsumedCapacity: 'TOTAL',
    ReturnItemCollectionMetrics: 'SIZE'
  }
  try {

    console.log("Creating for params", params)

    const dynamodbData = await dynamoDB.put(params).promise()
    console.log("Created in table: " + Constants.TEN_TEN_USERS_TABLE)

    return dynamodbData
  } catch (error) {
    console.log("Error", error)
    throw error
  }
}

export async function retrieveUserByName(name: String) {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: Constants.TEN_TEN_USERS_TABLE,
    IndexName: Constants.TEN_TEN_USERS_TABLE_NAME_IDX, // If you have a custom index for name
    KeyConditionExpression: '#nameAttr = :name',
    ExpressionAttributeNames: {
      "#nameAttr": "name" // Mapping 'name' (reserved keyword) to a placeholder
    },
    ExpressionAttributeValues: {
      ':name': name,
    }
  }

  const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: Constants.TEN_TEN_USERS_TABLE,
    FilterExpression: "contains(#nameAttr, :nameVal)",
    ExpressionAttributeNames: {
      "#nameAttr": "name",
    },
    ExpressionAttributeValues: {
      ":nameVal": name,
    },
  };


  var items = null

  try {
    const result = await dynamoDB.scan(scanParams).promise()
    items = result.Items || null
    return items
  } catch (error) {
    console.error('Error retrieving contacts by email:', error)
    throw error
  }
  return items
}

export async function retrieveUserByEmail(email: String) {

  console.log("Searching for email" + email)
  try {
    // Define the DynamoDB query parameters
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: Constants.TEN_TEN_USERS_TABLE,
      KeyConditionExpression: '',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    }

    // Check if partition key is provided and add it to the query
    if (email) {
      if (params.ExpressionAttributeNames) {
        // Use params.ExpressionAttributeNames safely here
        params.ExpressionAttributeNames['#partitionKey'] = Constants.TEN_TEN_USERS_TABLE_PARTITION_KEY

      }
      if (params.ExpressionAttributeValues) {
        // Use params.ExpressionAttributeValues safely here
        params.ExpressionAttributeValues[':partitionValue'] = email
      }
      params.KeyConditionExpression += '#partitionKey = :partitionValue'
    }

    let items
    console.log("Searching for params " + JSON.stringify(params))

    // Perform the query on the DynamoDB table
    const result = await dynamoDB.query(params).promise()

    console.log("Items found " + JSON.stringify(result))
    items = result.Items || null

    return items

  } catch (error) {
    console.log("Error  " + error)

    throw error
  }
}

/*

export async function persistContactVerification(contactId: String, contactVerificationId: String) {

  console.log("User ID", contactId)
  console.log("User verification ID", contactVerificationId)

  // Add autoVerify and alertAdmin in case of a new Contact being created
  const params = {
    TableName: Constants.CONTACTS_VERIFICATION_TABLE,
    Item: {
      contactId: contactId,
      contactVerificationId: contactVerificationId
    },
    ReturnConsumedCapacity: 'TOTAL',
    ReturnItemCollectionMetrics: 'SIZE'
  }
  try {
    console.log("Creating for params", params)

    const dynamodbData = await dynamoDB.put(params).promise()
    console.log("Created in table: " + Constants.CONTACTS_VERIFICATION_TABLE)

    return dynamodbData
  } catch (error) {
    console.log("Error", error)
    throw error
  }
}

// Validate phone number format. This regex covers several US phone number formats
export function validatePhone(phone: string) {
  if (phone) {
    // This regex covers several US phone number formats
    const phoneRegex = /^(?:\+1|1)[\s-]?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/
    if (phone && !phoneRegex.test(phone)) {
      return ["Validation Error - Invalid phone number format"]
    }
  }
  return []
}

// Regular expression for validating email
export function validateEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  if (!email) {
    return ["Validation Error - Missing or invalid email format"]
  }
  if (email && !emailRegex.test(email)) {
    return ["Validation Error - Invalid email format"]
  }

  return []
}

export async function validateExistingUser(email: string) {
  // Check if email already exists in the database
  const exists = await emailExistsInDatabase(email)
  if (!exists) {
    return ["Validation Error - No user with that email exists"]
  }

  return []
}

export async function validateExistingUserByContactId(contactId: string) {
  // Check if email already exists in the database
  const exists = await contactIdExistsInDatabase(contactId)
  if (!exists) {
    return ["Validation Error - No user with that contact ID exists"]
  }

  return []
}

export async function validateDuplicateUser(user: UserType) {
  // Check if email already exists in the database
  const exists = await emailExistsInDatabase(user.email)
  if (exists) {
    return ["Validation Error - Email already in use"]
  }

  return []
}

export async function alertAdmin(contactId: string) {
  const params = {
    Message: contactId
  }

  console.log("Trying to send message for", contactId)
  const snsClient = new SNSClient({ region: Constants.AWS_REGION })

  try {
    console.log("Sending message for", contactId)
    const publishCommand = new PublishCommand({
      TopicArn: Constants.ALERT_ADMIN_SNS_QUEUE,
      Message: contactId,
    })

    // Send the message
    const response = await snsClient.send(publishCommand)

    console.log("Sending message to queue", Constants.ALERT_ADMIN_SNS_QUEUE)

    console.log("SNS send message response", JSON.stringify(response))

  } catch (error) {
    throw error
  }
}

export async function verifyUser(contactId: string) {
  const params = {
    Message: contactId
  }

  const snsClient = new SNSClient({ region: Constants.AWS_REGION }) // Replace with your region

  try {
    const publishCommand = new PublishCommand({
      TopicArn: Constants.USER_VERIFICATION_SNS_QUEUE,
      Message: contactId,
    })
    console.log("Sending message for", contactId)

    // Send the message
    const response = await snsClient.send(publishCommand)
    console.log("Sending message to Queue", Constants.USER_VERIFICATION_SNS_QUEUE)

    console.log("SNS Send Message Response", JSON.stringify(response))

  } catch (error) {
    throw error
  }
}

export async function retrieveContactByEmail(email: string) {

  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: Constants.CONTACTS_TABLE,
    IndexName: Constants.CONTACTS_TABLE_EMAIL_IDX, // If you have a custom index for email
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    }
  }

  var items = null

  try {
    const result = await dynamoDB.query(params).promise()
    items = result.Items || null
    return items
  } catch (error) {
    console.error('Error retrieving contacts by email:', error)
    throw error
  }
  return items
}

export async function updateContactByEmail(email: string, existingUser: UserType, userFromEventBody: UserType) {
  try {
    const parsedExistingUser = JSON.parse(JSON.stringify(existingUser || '{}'))
    const parsedUserFromEventBody = JSON.parse(JSON.stringify(userFromEventBody || '{}'))

    console.log("Current user email", parsedExistingUser.email)
    console.log("Current user contactId", parsedExistingUser.contactId)

    console.log("To be updated user email", parsedUserFromEventBody.email)
    console.log("To be updated user contactId", parsedUserFromEventBody.contactId)

    console.log("Current user firstName", parsedExistingUser.firstName)
    console.log("To be updated user firstName", parsedUserFromEventBody.firstName)


    console.log("Setting params to update")
    const updateExpressionParts = []
    const expressionAttributeNames: Record<string, string> = {} // Explicitly specify the type
    const expressionAttributeValues: Record<string, any> = {} // Explicitly specify the type

    if (parsedUserFromEventBody.firstName && (parsedExistingUser.firstName !== parsedUserFromEventBody.firstName)) {
      console.log("firstName to be updated from " + parsedExistingUser.firstName + " to " + parsedUserFromEventBody.firstName)
      updateExpressionParts.push('#firstName = :firstName')
      expressionAttributeNames['#firstName'] = 'firstName'
      expressionAttributeValues[':firstName'] = parsedUserFromEventBody.firstName
    }

    if (parsedUserFromEventBody.lastName && (parsedExistingUser.lastName !== parsedUserFromEventBody.lastName)) {
      console.log("lastName to be updated from " + parsedExistingUser.lastName + " to " + parsedUserFromEventBody.lastName)
      updateExpressionParts.push('#lastName = :lastName')
      expressionAttributeNames['#lastName'] = 'lastName'
      expressionAttributeValues[':lastName'] = parsedUserFromEventBody.lastName
    }

    if (parsedUserFromEventBody.phone && (parsedExistingUser.phone !== parsedUserFromEventBody.phone)) {
      console.log("phone to be updated from " + parsedExistingUser.phone + " to " + parsedUserFromEventBody.phone)
      updateExpressionParts.push('#phone = :phone')
      expressionAttributeNames['#phone'] = 'phone'
      expressionAttributeValues[':phone'] = parsedUserFromEventBody.phone
    }

    if (parsedUserFromEventBody.owner && (parsedExistingUser.owner !== parsedUserFromEventBody.owner)) {
      console.log("owner to be updated from " + parsedExistingUser.owner + " to " + parsedUserFromEventBody.owner)
      updateExpressionParts.push('#owner = :owner')
      expressionAttributeNames['#owner'] = 'owner'
      expressionAttributeValues[':owner'] = parsedUserFromEventBody.owner
    }

    if (parsedUserFromEventBody.lists && (parsedExistingUser.lists !== parsedUserFromEventBody.lists)) {
      console.log("Lists to be updated from " + parsedExistingUser.lists + " to " + parsedUserFromEventBody.lists)
      updateExpressionParts.push('#lists = :lists')
      expressionAttributeNames['#lists'] = 'lists'
      expressionAttributeValues[':lists'] = parsedUserFromEventBody.lists
    }

    if (parsedUserFromEventBody.customFields && (parsedExistingUser.customFields !== parsedUserFromEventBody.customFields)) {
      console.log("customFields to be updated from " + parsedExistingUser.customFields + " to " + parsedUserFromEventBody.customFields)
      updateExpressionParts.push('#customFields = :customFields')
      expressionAttributeNames['#customFields'] = 'customFields'
      expressionAttributeValues[':customFields'] = parsedUserFromEventBody.customFields
    }

    if (updateExpressionParts.length === 0) {
      return {
        statusCode: Constants.SUCCESS,
        body: 'No changes detected. No updates were performed.',
      }
    }


    // Construct the final update expression
    const updateExpression = 'SET ' + updateExpressionParts.join(', ')

    const params = {
      TableName: Constants.CONTACTS_TABLE,
      Key: {
        contactId: parsedExistingUser.contactId,
        email: email
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW', // Specify what values should be returned after the update
    }
    console.log("Done Setting params to update")
    console.log("Updating User with email", email)

    let result

    result = await dynamoDB.update(params).promise()
    console.log('Updated contact:', result)


  } catch (error) {
    console.error('Error updating contact:', error)
    return {
      statusCode: Constants.ERROR,
      body: 'Error updating contact'
    }
    throw error
  }
  return {
    statusCode: Constants.SUCCESS,
    body: 'Updated contact Successfully'
  }

}
export async function updateContactAddMessageById(contactId: string, contactEmail: string, message: string) {
  try {
    const updateExpressionParts = []
    const expressionAttributeNames: Record<string, string> = {} // Explicitly specify the type
    const expressionAttributeValues: Record<string, any> = {} // Explicitly specify the type

    updateExpressionParts.push('#message = :message')
    expressionAttributeNames['#message'] = 'message'
    expressionAttributeValues[':message'] = message
    // Construct the final update expression
    const updateExpression = 'SET ' + updateExpressionParts.join(', ')

    const params = {
      TableName: Constants.CONTACTS_TABLE,
      Key: {
        contactId: contactId,
        email: contactEmail
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW', // Specify what values should be returned after the update
    }
    console.log("Updating User ID", contactId)

    let result

    result = await dynamoDB.update(params).promise()
    console.log('Updated contact:', result)
  } catch (error) {
    console.error('Error updating contact:', error)
    return {
      statusCode: Constants.ERROR,
      body: 'Error updating contact'
    }
    throw error
  }
  return {
    statusCode: Constants.SUCCESS,
    body: 'Updated contact Successfully'
  }

}

export async function updateContactById(contactId: string, existingUser: UserType, userFromEventBody: UserType) {
  try {
    const parsedExistingUser = JSON.parse(JSON.stringify(existingUser || '{}'))
    const parsedUserFromEventBody = JSON.parse(JSON.stringify(userFromEventBody || '{}'))

    console.log("Current user email", parsedExistingUser.email)
    console.log("Current user contactId", parsedExistingUser.contactId)

    console.log("To be updated user email", parsedUserFromEventBody.email)
    console.log("To be updated user contactId", parsedUserFromEventBody.contactId)

    console.log("Current user firstName", parsedExistingUser.firstName)
    console.log("To be updated user firstName", parsedUserFromEventBody.firstName)


    console.log("Setting params to update")
    const updateExpressionParts = []
    const expressionAttributeNames: Record<string, string> = {} // Explicitly specify the type
    const expressionAttributeValues: Record<string, any> = {} // Explicitly specify the type

    if (parsedUserFromEventBody.firstName && (parsedExistingUser.firstName !== parsedUserFromEventBody.firstName)) {
      console.log("firstName to be updated from " + parsedExistingUser.firstName + " to " + parsedUserFromEventBody.firstName)
      updateExpressionParts.push('#firstName = :firstName')
      expressionAttributeNames['#firstName'] = 'firstName'
      expressionAttributeValues[':firstName'] = parsedUserFromEventBody.firstName
    }

    if (parsedUserFromEventBody.lastName && (parsedExistingUser.lastName !== parsedUserFromEventBody.lastName)) {
      console.log("lastName to be updated from " + parsedExistingUser.lastName + " to " + parsedUserFromEventBody.lastName)
      updateExpressionParts.push('#lastName = :lastName')
      expressionAttributeNames['#lastName'] = 'lastName'
      expressionAttributeValues[':lastName'] = parsedUserFromEventBody.lastName
    }

    if (parsedUserFromEventBody.phone && (parsedExistingUser.phone !== parsedUserFromEventBody.phone)) {
      console.log("phone to be updated from " + parsedExistingUser.phone + " to " + parsedUserFromEventBody.phone)
      updateExpressionParts.push('#phone = :phone')
      expressionAttributeNames['#phone'] = 'phone'
      expressionAttributeValues[':phone'] = parsedUserFromEventBody.phone
    }

    if (parsedUserFromEventBody.owner && (parsedExistingUser.owner !== parsedUserFromEventBody.owner)) {
      console.log("owner to be updated from " + parsedExistingUser.owner + " to " + parsedUserFromEventBody.owner)
      updateExpressionParts.push('#owner = :owner')
      expressionAttributeNames['#owner'] = 'owner'
      expressionAttributeValues[':owner'] = parsedUserFromEventBody.owner
    }

    if (parsedUserFromEventBody.lists && (parsedExistingUser.lists !== parsedUserFromEventBody.lists)) {
      console.log("Lists to be updated from " + parsedExistingUser.lists + " to " + parsedUserFromEventBody.lists)
      updateExpressionParts.push('#lists = :lists')
      expressionAttributeNames['#lists'] = 'lists'
      expressionAttributeValues[':lists'] = parsedUserFromEventBody.lists
    }

    if (parsedUserFromEventBody.customFields && (parsedExistingUser.customFields !== parsedUserFromEventBody.customFields)) {
      console.log("customFields to be updated from " + parsedExistingUser.customFields + " to " + parsedUserFromEventBody.customFields)
      updateExpressionParts.push('#customFields = :customFields')
      expressionAttributeNames['#customFields'] = 'customFields'
      expressionAttributeValues[':customFields'] = parsedUserFromEventBody.customFields
    }

    if (updateExpressionParts.length === 0) {
      return {
        statusCode: Constants.SUCCESS,
        body: 'No changes detected. No updates were performed.',
      }
    }


    // Construct the final update expression
    const updateExpression = 'SET ' + updateExpressionParts.join(', ')

    const params = {
      TableName: Constants.CONTACTS_TABLE,
      Key: {
        contactId: contactId,
        email: parsedExistingUser.email
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW', // Specify what values should be returned after the update
    }
    console.log("Done setting params to update")
    console.log("Updating user ID", contactId)

    let result

    result = await dynamoDB.update(params).promise()
    console.log('Updated contact:', result)
  } catch (error) {
    console.error('Error updating contact:', error)
    return {
      statusCode: Constants.ERROR,
      body: 'Error updating contact'
    }
    throw error
  }
  return {
    statusCode: Constants.SUCCESS,
    body: 'Updated contact successfully'
  }
}

export async function unsubscribeContactFromAllLists(searchKey: any): Promise<any> {
  const searchKeyString = JSON.parse(JSON.stringify(searchKey))
  console.log("searchKey is " + searchKeyString)
  const key = searchKeyString.key
  const keyType = searchKeyString.type

  console.log("key is " + key)
  console.log("keyTpe is " + keyType)

  let params
  var currentContacts: any = ""
  var currentContact

  if (keyType == "sort-key") {
    console.log("searchKey type is sort key " + key)
    currentContacts = await retrieveContactByEmail(key)

  } else if (keyType == "partition-key") {
    console.log("searchKey type is partition key " + key)
    currentContacts = await retrieveUserByEmail(key)
  } else {
    return {
      statusCode: Constants.INTERNAL_ERROR,
      body: 'Illegal argument in request'
    }
  }

  if (keyType == "sort-key" || keyType == "partition-key") {
    if (currentContacts) {
      currentContact = currentContacts[0]
    }
    console.log("To be compared currentContact ", currentUserTypeUser)

    // Unsubscribe toBeUpdatedContact from all lists
    toBeUpdatedUser.lists = ['']

    console.log("keyType ", keyType)

    var updateResponse
    if (keyType === "partition-key") {
      console.log("in partition key ", keyType)

      updateResponse = await updateContactByPartitionKey(key, keyType, currentUserTypeUser, toBeUpdatedUser)
    } else if (keyType == "sort-key") {
      console.log("in sort key ", keyType)

      updateResponse = await updateContactBySortKey(key, keyType, currentUserTypeUser, toBeUpdatedUser)
    }
    return updateResponse
  }
}

export async function addContactSubscriptions(searchKey: any, listId: string): Promise<any> {
  const searchKeyString = JSON.parse(JSON.stringify(searchKey))
  console.log("searchKey is " + searchKeyString)
  const key = searchKeyString.key
  const keyType = searchKeyString.type

  console.log("key is " + key)
  CustomLogger.customContextLogger("keyType is ", keyType)
  CustomLogger.customContextLogger("listId is ", listId)

  let params
  var currentUserTypeUser: UserType = { email: "x@x.com", contactId: "x" }
  var toBeUpdatedUser: UserType = { email: "x@x.com", contactId: "x" }
  var currentContacts: any = ""
  var currentContact

  if (keyType == "sort-key") {
    CustomLogger.customContextLogger("searchKey type is sort key ", key)
    currentContacts = await retrieveContactByEmail(key)
    CustomLogger.customContextLogger("Number of currentContacts returned ", currentContacts.length)

  } else if (keyType == "partition-key") {
    CustomLogger.customContextLogger("searchKey type is partition key ", key)
    currentContacts = await retrieveContactById(key)
  } else {
    return {
      statusCode: Constants.INTERNAL_ERROR,
      body: 'Illegal argument in request'
    }
  }

  if (keyType == "sort-key" || keyType == "partition-key") {
    if (currentContacts) {
      currentContact = currentContacts[0]
      currentUserTypeUser.firstName = currentContact['firstName']
      CustomLogger.customContextLogger("TFirst Name XXXXX  ", currentUserTypeUser.firstName)
      currentUserTypeUser.lastName = currentContact['lastName']
      currentUserTypeUser.email = currentContact['email']
      currentUserTypeUser.contactId = currentContact['contactId']
      currentUserTypeUser.phone = currentContact['phone']
      currentUserTypeUser.lists = currentContact['lists']
      currentUserTypeUser.tags = currentContact['tags']
      currentUserTypeUser.customFields = currentContact['customFields']
      currentUserTypeUser.owner = currentContact['owner']
    }
    CustomLogger.customContextLogger("To be compared currentContact ", currentUserTypeUser)

    const listValidationErrors = validateIfUserIsAlreadySubscribed(listId, currentUserTypeUser)
    // Validation check and send error response where the existing user is already subscribed to this list
    if (listValidationErrors.length > 0) {
      throw new Error(listValidationErrors[0])
    }


    toBeUpdatedUser = appendListToBeUpdated(currentUserTypeUser, toBeUpdatedUser, listId)
    CustomLogger.customContextLogger("keyType ", keyType)

    var updateResponse
    if (keyType === "partition-key") {
      CustomLogger.customContextLogger("in partition key ", keyType)

      updateResponse = await updateContactByPartitionKey(key, keyType, currentUserTypeUser, toBeUpdatedUser)
    } else if (keyType == "sort-key") {
      CustomLogger.customContextLogger("in sort key ", keyType)

      updateResponse = await updateContactBySortKey(key, keyType, currentUserTypeUser, toBeUpdatedUser)
    }
    return updateResponse
  }
}

export async function deleteContactSubscriptions(searchKey: any, listId: string): Promise<any> {
  const searchKeyString = JSON.parse(JSON.stringify(searchKey))
  CustomLogger.customContextLogger("searchKey is ", searchKeyString)
  const key = searchKeyString.key
  const keyType = searchKeyString.type

  CustomLogger.customContextLogger("key is ", key)
  CustomLogger.customContextLogger("keyType is ", keyType)
  CustomLogger.customContextLogger("listId is ", listId)

  var currentUserTypeUser: UserType = { email: "x@x.com", contactId: "x" }
  var toBeUpdatedUser: UserType = { email: "x@x.com", contactId: "x" }
  var currentContacts: any = ""
  var currentContact

  if (keyType == "sort-key") {
    CustomLogger.customContextLogger("searchKey type is sort key ", key)
    currentContacts = await retrieveContactByEmail(key)

  } else if (keyType == "partition-key") {
    CustomLogger.customContextLogger("searchKey type is partition key ", key)
    currentContacts = await retrieveContactById(key)
  } else {
    return {
      statusCode: Constants.INTERNAL_ERROR,
      body: 'Illegal argument in request'
    }
  }
  if (keyType == "sort-key" || keyType == "partition-key") {
    if (currentContacts) {
      currentContact = currentContacts[0]
      currentUserTypeUser.firstName = currentContact['firstName']
      CustomLogger.customContextLogger("TFirst Name XXXXX  ", currentUserTypeUser.firstName)
      currentUserTypeUser.lastName = currentContact['lastName']
      currentUserTypeUser.email = currentContact['email']
      currentUserTypeUser.contactId = currentContact['contactId']
      currentUserTypeUser.phone = currentContact['phone']
      currentUserTypeUser.lists = currentContact['lists']
      currentUserTypeUser.tags = currentContact['tags']
      currentUserTypeUser.customFields = currentContact['customFields']
      currentUserTypeUser.owner = currentContact['owner']
    }
    CustomLogger.customContextLogger("To be compared currentContact ", currentUserTypeUser)


    const listValidationErrors = validateListSubscribed(listId, currentUserTypeUser)
    // Validation check and send error response where the existing user is already subscribed to this list
    if (listValidationErrors.length > 0) {
      throw new Error(listValidationErrors[0])
    }

    toBeUpdatedUser = deleteListToBeUpdated(currentUserTypeUser, toBeUpdatedUser, listId)
    CustomLogger.customContextLogger("keyType ", keyType)

    var updateResponse
    if (keyType === "partition-key") {
      CustomLogger.customContextLogger("in partition key ", keyType)

      updateResponse = await updateContactByPartitionKey(key, keyType, currentUserTypeUser, toBeUpdatedUser)
    } else if (keyType == "sort-key") {
      CustomLogger.customContextLogger("in sort key ", keyType)

      updateResponse = await updateContactBySortKey(key, keyType, currentUserTypeUser, toBeUpdatedUser)
    }
    return updateResponse
  }
}

function appendListToBeUpdated(currentUserTypeUser: UserType, toBeUpdatedUser: UserType, listId: string): UserType {
  toBeUpdatedUser.contactId = currentUserTypeUser.contactId
  toBeUpdatedUser.customFields = currentUserTypeUser.customFields
  toBeUpdatedUser.email = currentUserTypeUser.email
  toBeUpdatedUser.firstName = currentUserTypeUser.firstName
  toBeUpdatedUser.lastName = currentUserTypeUser.lastName
  toBeUpdatedUser.owner = currentUserTypeUser.owner
  toBeUpdatedUser.phone = currentUserTypeUser.phone
  toBeUpdatedUser.tags = currentUserTypeUser.tags

  if (currentUserTypeUser.lists) {
    // Create a copy of the current list
    const currentList: [string] = [...currentUserTypeUser.lists]

    // Append the new listId to the current list
    currentList.push(listId)

    // Update the lists property in toBeUpdatedUser
    toBeUpdatedUser.lists = currentList
  } else {
    // If currentUserTypeUser.lists is undefined, initialize it as a new array
    toBeUpdatedUser.lists = [listId]
  }

  return toBeUpdatedUser

}

function updateContactByPartitionKey(key: string, keyType: string, currentUserTypeUser: UserType, toBeUpdatedUser: UserType): any {
  return updateContactById(key, currentUserTypeUser, toBeUpdatedUser)
}

function updateContactBySortKey(key: string, keyType: string, currentUserTypeUser: UserType, toBeUpdatedUser: UserType): any {
  return updateContactByEmail(key, currentUserTypeUser, toBeUpdatedUser)
}

function deleteListToBeUpdated(currentUserTypeUser: UserType, toBeUpdatedUser: UserType, listId: string): UserType {
  toBeUpdatedUser.contactId = currentUserTypeUser.contactId
  toBeUpdatedUser.customFields = currentUserTypeUser.customFields
  toBeUpdatedUser.email = currentUserTypeUser.email
  toBeUpdatedUser.firstName = currentUserTypeUser.firstName
  toBeUpdatedUser.lastName = currentUserTypeUser.lastName
  toBeUpdatedUser.owner = currentUserTypeUser.owner
  toBeUpdatedUser.phone = currentUserTypeUser.phone
  toBeUpdatedUser.tags = currentUserTypeUser.tags


  if (currentUserTypeUser.lists && currentUserTypeUser.lists.length > 0) {
    // Filter out the listId from the current list
    const updatedList = currentUserTypeUser.lists.filter(item => item !== listId)

    // Handle the case where the updated list is empty
    if (updatedList.length === 0) {
      toBeUpdatedUser.lists = [] as unknown as [string] // Cast to [string] to satisfy the type requirement
    } else {
      // If there's at least one element, we can safely assign it
      toBeUpdatedUser.lists = updatedList as [string] // This cast might be unsafe if updatedList has more than one element
    }
  } else {
    // If currentUserTypeUser.lists is undefined or empty, there's nothing to delete
    toBeUpdatedUser.lists = [] as unknown as [string] // Cast to [string]
  }

  return toBeUpdatedUser
}

async function emailExistsInDatabase(email: string) {
  var emailExists = false
  var items = await retrieveContactByEmail(email)

  if (items != null && items.length > 0) {
    emailExists = true
  } else {
    emailExists = false
  }
  return emailExists
}

async function contactIdExistsInDatabase(contactId: string) {
  var contactIdExists = false
  var items = await retrieveContactById(contactId)

  if (items != null && items.length > 0) {
    contactIdExists = true
  } else {
    contactIdExists = false
  }
  return contactIdExists
}

function validateIfUserIsAlreadySubscribed(listId: string, currentContact: UserType) {
  const currentLists = currentContact.lists

  if (currentLists) {
    // Check if listId exists in currentLists
    if (currentLists.includes(listId)) {
      return ["Validation Error - User already subscribed to the list"]
    }
  }
  return []
}

function validateListSubscribed(listId: string, currentContact: UserType) {
  const currentLists = currentContact.lists

  if (currentLists) {
    // Check if listId exists in currentLists
    if (!currentLists.includes(listId)) {
      return ["Validation Error", "User not currently subscribed to the list"]
    }
  }
  return []

}
*/
