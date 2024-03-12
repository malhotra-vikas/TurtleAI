"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveUserByEmail = exports.createUser = void 0;
const AWS = require("aws-sdk");
const Constants = __importStar(require("../utils/constants"));
AWS.config.update({ region: Constants.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function createUser(userEmail, name) {
    var user = null;
    const newUser = true;
    console.log("User email", userEmail);
    console.log("User Name", name);
    // Add autoVerify and alertAdmin in case of a new Contact being created
    const params = {
        TableName: Constants.TEN_TEN_USERS_TABLE,
        Item: {
            email: userEmail,
            name: name
        },
        ReturnConsumedCapacity: 'TOTAL',
        ReturnItemCollectionMetrics: 'SIZE'
    };
    try {
        console.log("Creating for params", params);
        const dynamodbData = await dynamoDB.put(params).promise();
        console.log("Created in table: " + Constants.TEN_TEN_USERS_TABLE);
        return dynamodbData;
    }
    catch (error) {
        console.log("Error", error);
        throw error;
    }
}
exports.createUser = createUser;
async function retrieveUserByEmail(email) {
    console.log("Searching for email" + email);
    try {
        // Define the DynamoDB query parameters
        const params = {
            TableName: Constants.TEN_TEN_USERS_TABLE,
            KeyConditionExpression: '',
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {},
        };
        // Check if partition key is provided and add it to the query
        if (email) {
            if (params.ExpressionAttributeNames) {
                // Use params.ExpressionAttributeNames safely here
                params.ExpressionAttributeNames['#partitionKey'] = Constants.TEN_TEN_USERS_TABLE_PARTITION_KEY;
            }
            if (params.ExpressionAttributeValues) {
                // Use params.ExpressionAttributeValues safely here
                params.ExpressionAttributeValues[':partitionValue'] = email;
            }
            params.KeyConditionExpression += '#partitionKey = :partitionValue';
        }
        let items;
        console.log("Searching for params " + JSON.stringify(params));
        // Perform the query on the DynamoDB table
        const result = await dynamoDB.query(params).promise();
        console.log("Items found " + JSON.stringify(result));
        items = result.Items || null;
        return items;
    }
    catch (error) {
        console.log("Error  " + error);
        throw error;
    }
}
exports.retrieveUserByEmail = retrieveUserByEmail;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUUvQiw4REFBK0M7QUFJL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDbkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBRTNDLEtBQUssVUFBVSxVQUFVLENBQUMsU0FBaUIsRUFBRSxJQUFZO0lBRTlELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNmLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQTtJQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUU5Qix1RUFBdUU7SUFDdkUsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsU0FBUyxDQUFDLG1CQUFtQjtRQUN4QyxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsU0FBUztZQUNoQixJQUFJLEVBQUUsSUFBSTtTQUNYO1FBQ0Qsc0JBQXNCLEVBQUUsT0FBTztRQUMvQiwyQkFBMkIsRUFBRSxNQUFNO0tBQ3BDLENBQUE7SUFDRCxJQUFJO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUUxQyxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUVqRSxPQUFPLFlBQVksQ0FBQTtLQUNwQjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDM0IsTUFBTSxLQUFLLENBQUE7S0FDWjtBQUNILENBQUM7QUE5QkQsZ0NBOEJDO0FBRU0sS0FBSyxVQUFVLG1CQUFtQixDQUFDLEtBQWE7SUFFckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsQ0FBQTtJQUMxQyxJQUFJO1FBQ0YsdUNBQXVDO1FBQ3ZDLE1BQU0sTUFBTSxHQUEyQztZQUNyRCxTQUFTLEVBQUUsU0FBUyxDQUFDLG1CQUFtQjtZQUN4QyxzQkFBc0IsRUFBRSxFQUFFO1lBQzFCLHdCQUF3QixFQUFFLEVBQUU7WUFDNUIseUJBQXlCLEVBQUUsRUFBRTtTQUM5QixDQUFBO1FBRUQsNkRBQTZEO1FBQzdELElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxNQUFNLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ25DLGtEQUFrRDtnQkFDbEQsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQTthQUUvRjtZQUNELElBQUksTUFBTSxDQUFDLHlCQUF5QixFQUFFO2dCQUNwQyxtREFBbUQ7Z0JBQ25ELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEtBQUssQ0FBQTthQUM1RDtZQUNELE1BQU0sQ0FBQyxzQkFBc0IsSUFBSSxpQ0FBaUMsQ0FBQTtTQUNuRTtRQUVELElBQUksS0FBSyxDQUFBO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFFN0QsMENBQTBDO1FBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUVyRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDcEQsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFBO1FBRTVCLE9BQU8sS0FBSyxDQUFBO0tBRWI7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFBO1FBRTlCLE1BQU0sS0FBSyxDQUFBO0tBQ1o7QUFDSCxDQUFDO0FBMUNELGtEQTBDQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWt0QkUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG5pbXBvcnQgeyBVc2VyVHlwZSB9IGZyb20gXCIuLi91dGlscy91c2VyXCJcbmltcG9ydCAqIGFzIENvbnN0YW50cyBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCAqIGFzIEN1c3RvbUxvZ2dlciBmcm9tIFwiLi4vdXRpbHMvdHVydGxlYWktbG9nZ2VyXCJcbmltcG9ydCB7IFNOU0NsaWVudCwgUHVibGlzaENvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LXNuc1wiXG5cbkFXUy5jb25maWcudXBkYXRlKHsgcmVnaW9uOiBDb25zdGFudHMuQVdTX1JFR0lPTiB9KVxuY29uc3QgZHluYW1vREIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KClcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVVzZXIodXNlckVtYWlsOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuXG4gIHZhciB1c2VyID0gbnVsbFxuICBjb25zdCBuZXdVc2VyID0gdHJ1ZVxuXG4gIGNvbnNvbGUubG9nKFwiVXNlciBlbWFpbFwiLCB1c2VyRW1haWwpXG4gIGNvbnNvbGUubG9nKFwiVXNlciBOYW1lXCIsIG5hbWUpXG5cbiAgLy8gQWRkIGF1dG9WZXJpZnkgYW5kIGFsZXJ0QWRtaW4gaW4gY2FzZSBvZiBhIG5ldyBDb250YWN0IGJlaW5nIGNyZWF0ZWRcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIFRhYmxlTmFtZTogQ29uc3RhbnRzLlRFTl9URU5fVVNFUlNfVEFCTEUsXG4gICAgSXRlbToge1xuICAgICAgZW1haWw6IHVzZXJFbWFpbCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9LFxuICAgIFJldHVybkNvbnN1bWVkQ2FwYWNpdHk6ICdUT1RBTCcsXG4gICAgUmV0dXJuSXRlbUNvbGxlY3Rpb25NZXRyaWNzOiAnU0laRSdcbiAgfVxuICB0cnkge1xuXG4gICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBmb3IgcGFyYW1zXCIsIHBhcmFtcylcblxuICAgIGNvbnN0IGR5bmFtb2RiRGF0YSA9IGF3YWl0IGR5bmFtb0RCLnB1dChwYXJhbXMpLnByb21pc2UoKVxuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRlZCBpbiB0YWJsZTogXCIgKyBDb25zdGFudHMuVEVOX1RFTl9VU0VSU19UQUJMRSlcblxuICAgIHJldHVybiBkeW5hbW9kYkRhdGFcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yXCIsIGVycm9yKVxuICAgIHRocm93IGVycm9yXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJldHJpZXZlVXNlckJ5RW1haWwoZW1haWw6IFN0cmluZykge1xuXG4gIGNvbnNvbGUubG9nKFwiU2VhcmNoaW5nIGZvciBlbWFpbFwiICsgZW1haWwpXG4gIHRyeSB7XG4gICAgLy8gRGVmaW5lIHRoZSBEeW5hbW9EQiBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgY29uc3QgcGFyYW1zOiBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQuUXVlcnlJbnB1dCA9IHtcbiAgICAgIFRhYmxlTmFtZTogQ29uc3RhbnRzLlRFTl9URU5fVVNFUlNfVEFCTEUsXG4gICAgICBLZXlDb25kaXRpb25FeHByZXNzaW9uOiAnJyxcbiAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczoge30sXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7fSxcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBwYXJ0aXRpb24ga2V5IGlzIHByb3ZpZGVkIGFuZCBhZGQgaXQgdG8gdGhlIHF1ZXJ5XG4gICAgaWYgKGVtYWlsKSB7XG4gICAgICBpZiAocGFyYW1zLkV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lcykge1xuICAgICAgICAvLyBVc2UgcGFyYW1zLkV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lcyBzYWZlbHkgaGVyZVxuICAgICAgICBwYXJhbXMuRXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzWycjcGFydGl0aW9uS2V5J10gPSBDb25zdGFudHMuVEVOX1RFTl9VU0VSU19UQUJMRV9QQVJUSVRJT05fS0VZXG5cbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbXMuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcykge1xuICAgICAgICAvLyBVc2UgcGFyYW1zLkV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXMgc2FmZWx5IGhlcmVcbiAgICAgICAgcGFyYW1zLkV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNbJzpwYXJ0aXRpb25WYWx1ZSddID0gZW1haWxcbiAgICAgIH1cbiAgICAgIHBhcmFtcy5LZXlDb25kaXRpb25FeHByZXNzaW9uICs9ICcjcGFydGl0aW9uS2V5ID0gOnBhcnRpdGlvblZhbHVlJ1xuICAgIH1cblxuICAgIGxldCBpdGVtc1xuICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoaW5nIGZvciBwYXJhbXMgXCIgKyBKU09OLnN0cmluZ2lmeShwYXJhbXMpKVxuXG4gICAgLy8gUGVyZm9ybSB0aGUgcXVlcnkgb24gdGhlIER5bmFtb0RCIHRhYmxlXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZHluYW1vREIucXVlcnkocGFyYW1zKS5wcm9taXNlKClcblxuICAgIGNvbnNvbGUubG9nKFwiSXRlbXMgZm91bmQgXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxuICAgIGl0ZW1zID0gcmVzdWx0Lkl0ZW1zIHx8IG51bGxcblxuICAgIHJldHVybiBpdGVtc1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvciAgXCIgKyBlcnJvcilcblxuICAgIHRocm93IGVycm9yXG4gIH1cbn1cblxuLypcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBlcnNpc3RDb250YWN0VmVyaWZpY2F0aW9uKGNvbnRhY3RJZDogU3RyaW5nLCBjb250YWN0VmVyaWZpY2F0aW9uSWQ6IFN0cmluZykge1xuXG4gIGNvbnNvbGUubG9nKFwiVXNlciBJRFwiLCBjb250YWN0SWQpXG4gIGNvbnNvbGUubG9nKFwiVXNlciB2ZXJpZmljYXRpb24gSURcIiwgY29udGFjdFZlcmlmaWNhdGlvbklkKVxuXG4gIC8vIEFkZCBhdXRvVmVyaWZ5IGFuZCBhbGVydEFkbWluIGluIGNhc2Ugb2YgYSBuZXcgQ29udGFjdCBiZWluZyBjcmVhdGVkXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBUYWJsZU5hbWU6IENvbnN0YW50cy5DT05UQUNUU19WRVJJRklDQVRJT05fVEFCTEUsXG4gICAgSXRlbToge1xuICAgICAgY29udGFjdElkOiBjb250YWN0SWQsXG4gICAgICBjb250YWN0VmVyaWZpY2F0aW9uSWQ6IGNvbnRhY3RWZXJpZmljYXRpb25JZFxuICAgIH0sXG4gICAgUmV0dXJuQ29uc3VtZWRDYXBhY2l0eTogJ1RPVEFMJyxcbiAgICBSZXR1cm5JdGVtQ29sbGVjdGlvbk1ldHJpY3M6ICdTSVpFJ1xuICB9XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBmb3IgcGFyYW1zXCIsIHBhcmFtcylcblxuICAgIGNvbnN0IGR5bmFtb2RiRGF0YSA9IGF3YWl0IGR5bmFtb0RCLnB1dChwYXJhbXMpLnByb21pc2UoKVxuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRlZCBpbiB0YWJsZTogXCIgKyBDb25zdGFudHMuQ09OVEFDVFNfVkVSSUZJQ0FUSU9OX1RBQkxFKVxuXG4gICAgcmV0dXJuIGR5bmFtb2RiRGF0YVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3JcIiwgZXJyb3IpXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufVxuXG4vLyBWYWxpZGF0ZSBwaG9uZSBudW1iZXIgZm9ybWF0LiBUaGlzIHJlZ2V4IGNvdmVycyBzZXZlcmFsIFVTIHBob25lIG51bWJlciBmb3JtYXRzXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQaG9uZShwaG9uZTogc3RyaW5nKSB7XG4gIGlmIChwaG9uZSkge1xuICAgIC8vIFRoaXMgcmVnZXggY292ZXJzIHNldmVyYWwgVVMgcGhvbmUgbnVtYmVyIGZvcm1hdHNcbiAgICBjb25zdCBwaG9uZVJlZ2V4ID0gL14oPzpcXCsxfDEpW1xccy1dPyg/OlxcKFxcZHszfVxcKXxcXGR7M30pW1xccy1dP1xcZHszfVtcXHMtXT9cXGR7NH0kL1xuICAgIGlmIChwaG9uZSAmJiAhcGhvbmVSZWdleC50ZXN0KHBob25lKSkge1xuICAgICAgcmV0dXJuIFtcIlZhbGlkYXRpb24gRXJyb3IgLSBJbnZhbGlkIHBob25lIG51bWJlciBmb3JtYXRcIl1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgdmFsaWRhdGluZyBlbWFpbFxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWwoZW1haWw6IHN0cmluZykge1xuICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bYS16QS1aMC05Ll8tXStAW2EtekEtWjAtOS4tXStcXC5bYS16QS1aXXsyLDR9JC9cbiAgaWYgKCFlbWFpbCkge1xuICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yIC0gTWlzc2luZyBvciBpbnZhbGlkIGVtYWlsIGZvcm1hdFwiXVxuICB9XG4gIGlmIChlbWFpbCAmJiAhZW1haWxSZWdleC50ZXN0KGVtYWlsKSkge1xuICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yIC0gSW52YWxpZCBlbWFpbCBmb3JtYXRcIl1cbiAgfVxuXG4gIHJldHVybiBbXVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVFeGlzdGluZ1VzZXIoZW1haWw6IHN0cmluZykge1xuICAvLyBDaGVjayBpZiBlbWFpbCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgZGF0YWJhc2VcbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgZW1haWxFeGlzdHNJbkRhdGFiYXNlKGVtYWlsKVxuICBpZiAoIWV4aXN0cykge1xuICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yIC0gTm8gdXNlciB3aXRoIHRoYXQgZW1haWwgZXhpc3RzXCJdXG4gIH1cblxuICByZXR1cm4gW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlRXhpc3RpbmdVc2VyQnlDb250YWN0SWQoY29udGFjdElkOiBzdHJpbmcpIHtcbiAgLy8gQ2hlY2sgaWYgZW1haWwgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGRhdGFiYXNlXG4gIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGNvbnRhY3RJZEV4aXN0c0luRGF0YWJhc2UoY29udGFjdElkKVxuICBpZiAoIWV4aXN0cykge1xuICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yIC0gTm8gdXNlciB3aXRoIHRoYXQgY29udGFjdCBJRCBleGlzdHNcIl1cbiAgfVxuXG4gIHJldHVybiBbXVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVEdXBsaWNhdGVVc2VyKHVzZXI6IFVzZXJUeXBlKSB7XG4gIC8vIENoZWNrIGlmIGVtYWlsIGFscmVhZHkgZXhpc3RzIGluIHRoZSBkYXRhYmFzZVxuICBjb25zdCBleGlzdHMgPSBhd2FpdCBlbWFpbEV4aXN0c0luRGF0YWJhc2UodXNlci5lbWFpbClcbiAgaWYgKGV4aXN0cykge1xuICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yIC0gRW1haWwgYWxyZWFkeSBpbiB1c2VcIl1cbiAgfVxuXG4gIHJldHVybiBbXVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWxlcnRBZG1pbihjb250YWN0SWQ6IHN0cmluZykge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgTWVzc2FnZTogY29udGFjdElkXG4gIH1cblxuICBjb25zb2xlLmxvZyhcIlRyeWluZyB0byBzZW5kIG1lc3NhZ2UgZm9yXCIsIGNvbnRhY3RJZClcbiAgY29uc3Qgc25zQ2xpZW50ID0gbmV3IFNOU0NsaWVudCh7IHJlZ2lvbjogQ29uc3RhbnRzLkFXU19SRUdJT04gfSlcblxuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBtZXNzYWdlIGZvclwiLCBjb250YWN0SWQpXG4gICAgY29uc3QgcHVibGlzaENvbW1hbmQgPSBuZXcgUHVibGlzaENvbW1hbmQoe1xuICAgICAgVG9waWNBcm46IENvbnN0YW50cy5BTEVSVF9BRE1JTl9TTlNfUVVFVUUsXG4gICAgICBNZXNzYWdlOiBjb250YWN0SWQsXG4gICAgfSlcblxuICAgIC8vIFNlbmQgdGhlIG1lc3NhZ2VcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNuc0NsaWVudC5zZW5kKHB1Ymxpc2hDb21tYW5kKVxuXG4gICAgY29uc29sZS5sb2coXCJTZW5kaW5nIG1lc3NhZ2UgdG8gcXVldWVcIiwgQ29uc3RhbnRzLkFMRVJUX0FETUlOX1NOU19RVUVVRSlcblxuICAgIGNvbnNvbGUubG9nKFwiU05TIHNlbmQgbWVzc2FnZSByZXNwb25zZVwiLCBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpXG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvclxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlVc2VyKGNvbnRhY3RJZDogc3RyaW5nKSB7XG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBNZXNzYWdlOiBjb250YWN0SWRcbiAgfVxuXG4gIGNvbnN0IHNuc0NsaWVudCA9IG5ldyBTTlNDbGllbnQoeyByZWdpb246IENvbnN0YW50cy5BV1NfUkVHSU9OIH0pIC8vIFJlcGxhY2Ugd2l0aCB5b3VyIHJlZ2lvblxuXG4gIHRyeSB7XG4gICAgY29uc3QgcHVibGlzaENvbW1hbmQgPSBuZXcgUHVibGlzaENvbW1hbmQoe1xuICAgICAgVG9waWNBcm46IENvbnN0YW50cy5VU0VSX1ZFUklGSUNBVElPTl9TTlNfUVVFVUUsXG4gICAgICBNZXNzYWdlOiBjb250YWN0SWQsXG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgbWVzc2FnZSBmb3JcIiwgY29udGFjdElkKVxuXG4gICAgLy8gU2VuZCB0aGUgbWVzc2FnZVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc25zQ2xpZW50LnNlbmQocHVibGlzaENvbW1hbmQpXG4gICAgY29uc29sZS5sb2coXCJTZW5kaW5nIG1lc3NhZ2UgdG8gUXVldWVcIiwgQ29uc3RhbnRzLlVTRVJfVkVSSUZJQ0FUSU9OX1NOU19RVUVVRSlcblxuICAgIGNvbnNvbGUubG9nKFwiU05TIFNlbmQgTWVzc2FnZSBSZXNwb25zZVwiLCBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpXG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvclxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXRyaWV2ZUNvbnRhY3RCeUVtYWlsKGVtYWlsOiBzdHJpbmcpIHtcblxuICBjb25zdCBwYXJhbXM6IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudC5RdWVyeUlucHV0ID0ge1xuICAgIFRhYmxlTmFtZTogQ29uc3RhbnRzLkNPTlRBQ1RTX1RBQkxFLFxuICAgIEluZGV4TmFtZTogQ29uc3RhbnRzLkNPTlRBQ1RTX1RBQkxFX0VNQUlMX0lEWCwgLy8gSWYgeW91IGhhdmUgYSBjdXN0b20gaW5kZXggZm9yIGVtYWlsXG4gICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogJ2VtYWlsID0gOmVtYWlsJyxcbiAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAnOmVtYWlsJzogZW1haWwsXG4gICAgfVxuICB9XG5cbiAgdmFyIGl0ZW1zID0gbnVsbFxuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZHluYW1vREIucXVlcnkocGFyYW1zKS5wcm9taXNlKClcbiAgICBpdGVtcyA9IHJlc3VsdC5JdGVtcyB8fCBudWxsXG4gICAgcmV0dXJuIGl0ZW1zXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcmV0cmlldmluZyBjb250YWN0cyBieSBlbWFpbDonLCBlcnJvcilcbiAgICB0aHJvdyBlcnJvclxuICB9XG4gIHJldHVybiBpdGVtc1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ29udGFjdEJ5RW1haWwoZW1haWw6IHN0cmluZywgZXhpc3RpbmdVc2VyOiBVc2VyVHlwZSwgdXNlckZyb21FdmVudEJvZHk6IFVzZXJUeXBlKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkRXhpc3RpbmdVc2VyID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShleGlzdGluZ1VzZXIgfHwgJ3t9JykpXG4gICAgY29uc3QgcGFyc2VkVXNlckZyb21FdmVudEJvZHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHVzZXJGcm9tRXZlbnRCb2R5IHx8ICd7fScpKVxuXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50IHVzZXIgZW1haWxcIiwgcGFyc2VkRXhpc3RpbmdVc2VyLmVtYWlsKVxuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCB1c2VyIGNvbnRhY3RJZFwiLCBwYXJzZWRFeGlzdGluZ1VzZXIuY29udGFjdElkKVxuXG4gICAgY29uc29sZS5sb2coXCJUbyBiZSB1cGRhdGVkIHVzZXIgZW1haWxcIiwgcGFyc2VkVXNlckZyb21FdmVudEJvZHkuZW1haWwpXG4gICAgY29uc29sZS5sb2coXCJUbyBiZSB1cGRhdGVkIHVzZXIgY29udGFjdElkXCIsIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmNvbnRhY3RJZClcblxuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCB1c2VyIGZpcnN0TmFtZVwiLCBwYXJzZWRFeGlzdGluZ1VzZXIuZmlyc3ROYW1lKVxuICAgIGNvbnNvbGUubG9nKFwiVG8gYmUgdXBkYXRlZCB1c2VyIGZpcnN0TmFtZVwiLCBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5maXJzdE5hbWUpXG5cblxuICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyBwYXJhbXMgdG8gdXBkYXRlXCIpXG4gICAgY29uc3QgdXBkYXRlRXhwcmVzc2lvblBhcnRzID0gW11cbiAgICBjb25zdCBleHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSAvLyBFeHBsaWNpdGx5IHNwZWNpZnkgdGhlIHR5cGVcbiAgICBjb25zdCBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30gLy8gRXhwbGljaXRseSBzcGVjaWZ5IHRoZSB0eXBlXG5cbiAgICBpZiAocGFyc2VkVXNlckZyb21FdmVudEJvZHkuZmlyc3ROYW1lICYmIChwYXJzZWRFeGlzdGluZ1VzZXIuZmlyc3ROYW1lICE9PSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5maXJzdE5hbWUpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImZpcnN0TmFtZSB0byBiZSB1cGRhdGVkIGZyb20gXCIgKyBwYXJzZWRFeGlzdGluZ1VzZXIuZmlyc3ROYW1lICsgXCIgdG8gXCIgKyBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5maXJzdE5hbWUpXG4gICAgICB1cGRhdGVFeHByZXNzaW9uUGFydHMucHVzaCgnI2ZpcnN0TmFtZSA9IDpmaXJzdE5hbWUnKVxuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzWycjZmlyc3ROYW1lJ10gPSAnZmlyc3ROYW1lJ1xuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlc1snOmZpcnN0TmFtZSddID0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkuZmlyc3ROYW1lXG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxhc3ROYW1lICYmIChwYXJzZWRFeGlzdGluZ1VzZXIubGFzdE5hbWUgIT09IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxhc3ROYW1lKSkge1xuICAgICAgY29uc29sZS5sb2coXCJsYXN0TmFtZSB0byBiZSB1cGRhdGVkIGZyb20gXCIgKyBwYXJzZWRFeGlzdGluZ1VzZXIubGFzdE5hbWUgKyBcIiB0byBcIiArIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxhc3ROYW1lKVxuICAgICAgdXBkYXRlRXhwcmVzc2lvblBhcnRzLnB1c2goJyNsYXN0TmFtZSA9IDpsYXN0TmFtZScpXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlTmFtZXNbJyNsYXN0TmFtZSddID0gJ2xhc3ROYW1lJ1xuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlc1snOmxhc3ROYW1lJ10gPSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5sYXN0TmFtZVxuICAgIH1cblxuICAgIGlmIChwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5waG9uZSAmJiAocGFyc2VkRXhpc3RpbmdVc2VyLnBob25lICE9PSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5waG9uZSkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicGhvbmUgdG8gYmUgdXBkYXRlZCBmcm9tIFwiICsgcGFyc2VkRXhpc3RpbmdVc2VyLnBob25lICsgXCIgdG8gXCIgKyBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5waG9uZSlcbiAgICAgIHVwZGF0ZUV4cHJlc3Npb25QYXJ0cy5wdXNoKCcjcGhvbmUgPSA6cGhvbmUnKVxuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzWycjcGhvbmUnXSA9ICdwaG9uZSdcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNbJzpwaG9uZSddID0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkucGhvbmVcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkVXNlckZyb21FdmVudEJvZHkub3duZXIgJiYgKHBhcnNlZEV4aXN0aW5nVXNlci5vd25lciAhPT0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkub3duZXIpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm93bmVyIHRvIGJlIHVwZGF0ZWQgZnJvbSBcIiArIHBhcnNlZEV4aXN0aW5nVXNlci5vd25lciArIFwiIHRvIFwiICsgcGFyc2VkVXNlckZyb21FdmVudEJvZHkub3duZXIpXG4gICAgICB1cGRhdGVFeHByZXNzaW9uUGFydHMucHVzaCgnI293bmVyID0gOm93bmVyJylcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lc1snI293bmVyJ10gPSAnb3duZXInXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzWyc6b3duZXInXSA9IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lm93bmVyXG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxpc3RzICYmIChwYXJzZWRFeGlzdGluZ1VzZXIubGlzdHMgIT09IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxpc3RzKSkge1xuICAgICAgY29uc29sZS5sb2coXCJMaXN0cyB0byBiZSB1cGRhdGVkIGZyb20gXCIgKyBwYXJzZWRFeGlzdGluZ1VzZXIubGlzdHMgKyBcIiB0byBcIiArIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxpc3RzKVxuICAgICAgdXBkYXRlRXhwcmVzc2lvblBhcnRzLnB1c2goJyNsaXN0cyA9IDpsaXN0cycpXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlTmFtZXNbJyNsaXN0cyddID0gJ2xpc3RzJ1xuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlc1snOmxpc3RzJ10gPSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5saXN0c1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5jdXN0b21GaWVsZHMgJiYgKHBhcnNlZEV4aXN0aW5nVXNlci5jdXN0b21GaWVsZHMgIT09IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmN1c3RvbUZpZWxkcykpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiY3VzdG9tRmllbGRzIHRvIGJlIHVwZGF0ZWQgZnJvbSBcIiArIHBhcnNlZEV4aXN0aW5nVXNlci5jdXN0b21GaWVsZHMgKyBcIiB0byBcIiArIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmN1c3RvbUZpZWxkcylcbiAgICAgIHVwZGF0ZUV4cHJlc3Npb25QYXJ0cy5wdXNoKCcjY3VzdG9tRmllbGRzID0gOmN1c3RvbUZpZWxkcycpXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlTmFtZXNbJyNjdXN0b21GaWVsZHMnXSA9ICdjdXN0b21GaWVsZHMnXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzWyc6Y3VzdG9tRmllbGRzJ10gPSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5jdXN0b21GaWVsZHNcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlRXhwcmVzc2lvblBhcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogQ29uc3RhbnRzLlNVQ0NFU1MsXG4gICAgICAgIGJvZHk6ICdObyBjaGFuZ2VzIGRldGVjdGVkLiBObyB1cGRhdGVzIHdlcmUgcGVyZm9ybWVkLicsXG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIGZpbmFsIHVwZGF0ZSBleHByZXNzaW9uXG4gICAgY29uc3QgdXBkYXRlRXhwcmVzc2lvbiA9ICdTRVQgJyArIHVwZGF0ZUV4cHJlc3Npb25QYXJ0cy5qb2luKCcsICcpXG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBUYWJsZU5hbWU6IENvbnN0YW50cy5DT05UQUNUU19UQUJMRSxcbiAgICAgIEtleToge1xuICAgICAgICBjb250YWN0SWQ6IHBhcnNlZEV4aXN0aW5nVXNlci5jb250YWN0SWQsXG4gICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgfSxcbiAgICAgIFVwZGF0ZUV4cHJlc3Npb246IHVwZGF0ZUV4cHJlc3Npb24sXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lcyxcbiAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXMsXG4gICAgICBSZXR1cm5WYWx1ZXM6ICdVUERBVEVEX05FVycsIC8vIFNwZWNpZnkgd2hhdCB2YWx1ZXMgc2hvdWxkIGJlIHJldHVybmVkIGFmdGVyIHRoZSB1cGRhdGVcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJEb25lIFNldHRpbmcgcGFyYW1zIHRvIHVwZGF0ZVwiKVxuICAgIGNvbnNvbGUubG9nKFwiVXBkYXRpbmcgVXNlciB3aXRoIGVtYWlsXCIsIGVtYWlsKVxuXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgcmVzdWx0ID0gYXdhaXQgZHluYW1vREIudXBkYXRlKHBhcmFtcykucHJvbWlzZSgpXG4gICAgY29uc29sZS5sb2coJ1VwZGF0ZWQgY29udGFjdDonLCByZXN1bHQpXG5cblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIGNvbnRhY3Q6JywgZXJyb3IpXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IENvbnN0YW50cy5FUlJPUixcbiAgICAgIGJvZHk6ICdFcnJvciB1cGRhdGluZyBjb250YWN0J1xuICAgIH1cbiAgICB0aHJvdyBlcnJvclxuICB9XG4gIHJldHVybiB7XG4gICAgc3RhdHVzQ29kZTogQ29uc3RhbnRzLlNVQ0NFU1MsXG4gICAgYm9keTogJ1VwZGF0ZWQgY29udGFjdCBTdWNjZXNzZnVsbHknXG4gIH1cblxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvbnRhY3RBZGRNZXNzYWdlQnlJZChjb250YWN0SWQ6IHN0cmluZywgY29udGFjdEVtYWlsOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IHVwZGF0ZUV4cHJlc3Npb25QYXJ0cyA9IFtdXG4gICAgY29uc3QgZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge30gLy8gRXhwbGljaXRseSBzcGVjaWZ5IHRoZSB0eXBlXG4gICAgY29uc3QgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9IC8vIEV4cGxpY2l0bHkgc3BlY2lmeSB0aGUgdHlwZVxuXG4gICAgdXBkYXRlRXhwcmVzc2lvblBhcnRzLnB1c2goJyNtZXNzYWdlID0gOm1lc3NhZ2UnKVxuICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lc1snI21lc3NhZ2UnXSA9ICdtZXNzYWdlJ1xuICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNbJzptZXNzYWdlJ10gPSBtZXNzYWdlXG4gICAgLy8gQ29uc3RydWN0IHRoZSBmaW5hbCB1cGRhdGUgZXhwcmVzc2lvblxuICAgIGNvbnN0IHVwZGF0ZUV4cHJlc3Npb24gPSAnU0VUICcgKyB1cGRhdGVFeHByZXNzaW9uUGFydHMuam9pbignLCAnKVxuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgVGFibGVOYW1lOiBDb25zdGFudHMuQ09OVEFDVFNfVEFCTEUsXG4gICAgICBLZXk6IHtcbiAgICAgICAgY29udGFjdElkOiBjb250YWN0SWQsXG4gICAgICAgIGVtYWlsOiBjb250YWN0RW1haWxcbiAgICAgIH0sXG4gICAgICBVcGRhdGVFeHByZXNzaW9uOiB1cGRhdGVFeHByZXNzaW9uLFxuICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzOiBleHByZXNzaW9uQXR0cmlidXRlTmFtZXMsXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzLFxuICAgICAgUmV0dXJuVmFsdWVzOiAnVVBEQVRFRF9ORVcnLCAvLyBTcGVjaWZ5IHdoYXQgdmFsdWVzIHNob3VsZCBiZSByZXR1cm5lZCBhZnRlciB0aGUgdXBkYXRlXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiVXBkYXRpbmcgVXNlciBJRFwiLCBjb250YWN0SWQpXG5cbiAgICBsZXQgcmVzdWx0XG5cbiAgICByZXN1bHQgPSBhd2FpdCBkeW5hbW9EQi51cGRhdGUocGFyYW1zKS5wcm9taXNlKClcbiAgICBjb25zb2xlLmxvZygnVXBkYXRlZCBjb250YWN0OicsIHJlc3VsdClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyBjb250YWN0OicsIGVycm9yKVxuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXNDb2RlOiBDb25zdGFudHMuRVJST1IsXG4gICAgICBib2R5OiAnRXJyb3IgdXBkYXRpbmcgY29udGFjdCdcbiAgICB9XG4gICAgdGhyb3cgZXJyb3JcbiAgfVxuICByZXR1cm4ge1xuICAgIHN0YXR1c0NvZGU6IENvbnN0YW50cy5TVUNDRVNTLFxuICAgIGJvZHk6ICdVcGRhdGVkIGNvbnRhY3QgU3VjY2Vzc2Z1bGx5J1xuICB9XG5cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvbnRhY3RCeUlkKGNvbnRhY3RJZDogc3RyaW5nLCBleGlzdGluZ1VzZXI6IFVzZXJUeXBlLCB1c2VyRnJvbUV2ZW50Qm9keTogVXNlclR5cGUpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWRFeGlzdGluZ1VzZXIgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nVXNlciB8fCAne30nKSlcbiAgICBjb25zdCBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodXNlckZyb21FdmVudEJvZHkgfHwgJ3t9JykpXG5cbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgdXNlciBlbWFpbFwiLCBwYXJzZWRFeGlzdGluZ1VzZXIuZW1haWwpXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50IHVzZXIgY29udGFjdElkXCIsIHBhcnNlZEV4aXN0aW5nVXNlci5jb250YWN0SWQpXG5cbiAgICBjb25zb2xlLmxvZyhcIlRvIGJlIHVwZGF0ZWQgdXNlciBlbWFpbFwiLCBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5lbWFpbClcbiAgICBjb25zb2xlLmxvZyhcIlRvIGJlIHVwZGF0ZWQgdXNlciBjb250YWN0SWRcIiwgcGFyc2VkVXNlckZyb21FdmVudEJvZHkuY29udGFjdElkKVxuXG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50IHVzZXIgZmlyc3ROYW1lXCIsIHBhcnNlZEV4aXN0aW5nVXNlci5maXJzdE5hbWUpXG4gICAgY29uc29sZS5sb2coXCJUbyBiZSB1cGRhdGVkIHVzZXIgZmlyc3ROYW1lXCIsIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmZpcnN0TmFtZSlcblxuXG4gICAgY29uc29sZS5sb2coXCJTZXR0aW5nIHBhcmFtcyB0byB1cGRhdGVcIilcbiAgICBjb25zdCB1cGRhdGVFeHByZXNzaW9uUGFydHMgPSBbXVxuICAgIGNvbnN0IGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9IC8vIEV4cGxpY2l0bHkgc3BlY2lmeSB0aGUgdHlwZVxuICAgIGNvbnN0IGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSAvLyBFeHBsaWNpdGx5IHNwZWNpZnkgdGhlIHR5cGVcblxuICAgIGlmIChwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5maXJzdE5hbWUgJiYgKHBhcnNlZEV4aXN0aW5nVXNlci5maXJzdE5hbWUgIT09IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmZpcnN0TmFtZSkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZmlyc3ROYW1lIHRvIGJlIHVwZGF0ZWQgZnJvbSBcIiArIHBhcnNlZEV4aXN0aW5nVXNlci5maXJzdE5hbWUgKyBcIiB0byBcIiArIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmZpcnN0TmFtZSlcbiAgICAgIHVwZGF0ZUV4cHJlc3Npb25QYXJ0cy5wdXNoKCcjZmlyc3ROYW1lID0gOmZpcnN0TmFtZScpXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlTmFtZXNbJyNmaXJzdE5hbWUnXSA9ICdmaXJzdE5hbWUnXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzWyc6Zmlyc3ROYW1lJ10gPSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5maXJzdE5hbWVcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkVXNlckZyb21FdmVudEJvZHkubGFzdE5hbWUgJiYgKHBhcnNlZEV4aXN0aW5nVXNlci5sYXN0TmFtZSAhPT0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkubGFzdE5hbWUpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImxhc3ROYW1lIHRvIGJlIHVwZGF0ZWQgZnJvbSBcIiArIHBhcnNlZEV4aXN0aW5nVXNlci5sYXN0TmFtZSArIFwiIHRvIFwiICsgcGFyc2VkVXNlckZyb21FdmVudEJvZHkubGFzdE5hbWUpXG4gICAgICB1cGRhdGVFeHByZXNzaW9uUGFydHMucHVzaCgnI2xhc3ROYW1lID0gOmxhc3ROYW1lJylcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lc1snI2xhc3ROYW1lJ10gPSAnbGFzdE5hbWUnXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzWyc6bGFzdE5hbWUnXSA9IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxhc3ROYW1lXG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LnBob25lICYmIChwYXJzZWRFeGlzdGluZ1VzZXIucGhvbmUgIT09IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LnBob25lKSkge1xuICAgICAgY29uc29sZS5sb2coXCJwaG9uZSB0byBiZSB1cGRhdGVkIGZyb20gXCIgKyBwYXJzZWRFeGlzdGluZ1VzZXIucGhvbmUgKyBcIiB0byBcIiArIHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LnBob25lKVxuICAgICAgdXBkYXRlRXhwcmVzc2lvblBhcnRzLnB1c2goJyNwaG9uZSA9IDpwaG9uZScpXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlTmFtZXNbJyNwaG9uZSddID0gJ3Bob25lJ1xuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlc1snOnBob25lJ10gPSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5waG9uZVxuICAgIH1cblxuICAgIGlmIChwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5vd25lciAmJiAocGFyc2VkRXhpc3RpbmdVc2VyLm93bmVyICE9PSBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5vd25lcikpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwib3duZXIgdG8gYmUgdXBkYXRlZCBmcm9tIFwiICsgcGFyc2VkRXhpc3RpbmdVc2VyLm93bmVyICsgXCIgdG8gXCIgKyBwYXJzZWRVc2VyRnJvbUV2ZW50Qm9keS5vd25lcilcbiAgICAgIHVwZGF0ZUV4cHJlc3Npb25QYXJ0cy5wdXNoKCcjb3duZXIgPSA6b3duZXInKVxuICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzWycjb3duZXInXSA9ICdvd25lcidcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNbJzpvd25lciddID0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkub3duZXJcbiAgICB9XG5cbiAgICBpZiAocGFyc2VkVXNlckZyb21FdmVudEJvZHkubGlzdHMgJiYgKHBhcnNlZEV4aXN0aW5nVXNlci5saXN0cyAhPT0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkubGlzdHMpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkxpc3RzIHRvIGJlIHVwZGF0ZWQgZnJvbSBcIiArIHBhcnNlZEV4aXN0aW5nVXNlci5saXN0cyArIFwiIHRvIFwiICsgcGFyc2VkVXNlckZyb21FdmVudEJvZHkubGlzdHMpXG4gICAgICB1cGRhdGVFeHByZXNzaW9uUGFydHMucHVzaCgnI2xpc3RzID0gOmxpc3RzJylcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lc1snI2xpc3RzJ10gPSAnbGlzdHMnXG4gICAgICBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzWyc6bGlzdHMnXSA9IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5Lmxpc3RzXG4gICAgfVxuXG4gICAgaWYgKHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmN1c3RvbUZpZWxkcyAmJiAocGFyc2VkRXhpc3RpbmdVc2VyLmN1c3RvbUZpZWxkcyAhPT0gcGFyc2VkVXNlckZyb21FdmVudEJvZHkuY3VzdG9tRmllbGRzKSkge1xuICAgICAgY29uc29sZS5sb2coXCJjdXN0b21GaWVsZHMgdG8gYmUgdXBkYXRlZCBmcm9tIFwiICsgcGFyc2VkRXhpc3RpbmdVc2VyLmN1c3RvbUZpZWxkcyArIFwiIHRvIFwiICsgcGFyc2VkVXNlckZyb21FdmVudEJvZHkuY3VzdG9tRmllbGRzKVxuICAgICAgdXBkYXRlRXhwcmVzc2lvblBhcnRzLnB1c2goJyNjdXN0b21GaWVsZHMgPSA6Y3VzdG9tRmllbGRzJylcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lc1snI2N1c3RvbUZpZWxkcyddID0gJ2N1c3RvbUZpZWxkcydcbiAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNbJzpjdXN0b21GaWVsZHMnXSA9IHBhcnNlZFVzZXJGcm9tRXZlbnRCb2R5LmN1c3RvbUZpZWxkc1xuICAgIH1cblxuICAgIGlmICh1cGRhdGVFeHByZXNzaW9uUGFydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXNDb2RlOiBDb25zdGFudHMuU1VDQ0VTUyxcbiAgICAgICAgYm9keTogJ05vIGNoYW5nZXMgZGV0ZWN0ZWQuIE5vIHVwZGF0ZXMgd2VyZSBwZXJmb3JtZWQuJyxcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIENvbnN0cnVjdCB0aGUgZmluYWwgdXBkYXRlIGV4cHJlc3Npb25cbiAgICBjb25zdCB1cGRhdGVFeHByZXNzaW9uID0gJ1NFVCAnICsgdXBkYXRlRXhwcmVzc2lvblBhcnRzLmpvaW4oJywgJylcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIFRhYmxlTmFtZTogQ29uc3RhbnRzLkNPTlRBQ1RTX1RBQkxFLFxuICAgICAgS2V5OiB7XG4gICAgICAgIGNvbnRhY3RJZDogY29udGFjdElkLFxuICAgICAgICBlbWFpbDogcGFyc2VkRXhpc3RpbmdVc2VyLmVtYWlsXG4gICAgICB9LFxuICAgICAgVXBkYXRlRXhwcmVzc2lvbjogdXBkYXRlRXhwcmVzc2lvbixcbiAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczogZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzLFxuICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczogZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyxcbiAgICAgIFJldHVyblZhbHVlczogJ1VQREFURURfTkVXJywgLy8gU3BlY2lmeSB3aGF0IHZhbHVlcyBzaG91bGQgYmUgcmV0dXJuZWQgYWZ0ZXIgdGhlIHVwZGF0ZVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkRvbmUgc2V0dGluZyBwYXJhbXMgdG8gdXBkYXRlXCIpXG4gICAgY29uc29sZS5sb2coXCJVcGRhdGluZyB1c2VyIElEXCIsIGNvbnRhY3RJZClcblxuICAgIGxldCByZXN1bHRcblxuICAgIHJlc3VsdCA9IGF3YWl0IGR5bmFtb0RCLnVwZGF0ZShwYXJhbXMpLnByb21pc2UoKVxuICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbnRhY3Q6JywgcmVzdWx0KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIGNvbnRhY3Q6JywgZXJyb3IpXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IENvbnN0YW50cy5FUlJPUixcbiAgICAgIGJvZHk6ICdFcnJvciB1cGRhdGluZyBjb250YWN0J1xuICAgIH1cbiAgICB0aHJvdyBlcnJvclxuICB9XG4gIHJldHVybiB7XG4gICAgc3RhdHVzQ29kZTogQ29uc3RhbnRzLlNVQ0NFU1MsXG4gICAgYm9keTogJ1VwZGF0ZWQgY29udGFjdCBzdWNjZXNzZnVsbHknXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVuc3Vic2NyaWJlQ29udGFjdEZyb21BbGxMaXN0cyhzZWFyY2hLZXk6IGFueSk6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IHNlYXJjaEtleVN0cmluZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VhcmNoS2V5KSlcbiAgY29uc29sZS5sb2coXCJzZWFyY2hLZXkgaXMgXCIgKyBzZWFyY2hLZXlTdHJpbmcpXG4gIGNvbnN0IGtleSA9IHNlYXJjaEtleVN0cmluZy5rZXlcbiAgY29uc3Qga2V5VHlwZSA9IHNlYXJjaEtleVN0cmluZy50eXBlXG5cbiAgY29uc29sZS5sb2coXCJrZXkgaXMgXCIgKyBrZXkpXG4gIGNvbnNvbGUubG9nKFwia2V5VHBlIGlzIFwiICsga2V5VHlwZSlcblxuICBsZXQgcGFyYW1zXG4gIHZhciBjdXJyZW50Q29udGFjdHM6IGFueSA9IFwiXCJcbiAgdmFyIGN1cnJlbnRDb250YWN0XG5cbiAgaWYgKGtleVR5cGUgPT0gXCJzb3J0LWtleVwiKSB7XG4gICAgY29uc29sZS5sb2coXCJzZWFyY2hLZXkgdHlwZSBpcyBzb3J0IGtleSBcIiArIGtleSlcbiAgICBjdXJyZW50Q29udGFjdHMgPSBhd2FpdCByZXRyaWV2ZUNvbnRhY3RCeUVtYWlsKGtleSlcblxuICB9IGVsc2UgaWYgKGtleVR5cGUgPT0gXCJwYXJ0aXRpb24ta2V5XCIpIHtcbiAgICBjb25zb2xlLmxvZyhcInNlYXJjaEtleSB0eXBlIGlzIHBhcnRpdGlvbiBrZXkgXCIgKyBrZXkpXG4gICAgY3VycmVudENvbnRhY3RzID0gYXdhaXQgcmV0cmlldmVVc2VyQnlFbWFpbChrZXkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUixcbiAgICAgIGJvZHk6ICdJbGxlZ2FsIGFyZ3VtZW50IGluIHJlcXVlc3QnXG4gICAgfVxuICB9XG5cbiAgaWYgKGtleVR5cGUgPT0gXCJzb3J0LWtleVwiIHx8IGtleVR5cGUgPT0gXCJwYXJ0aXRpb24ta2V5XCIpIHtcbiAgICBpZiAoY3VycmVudENvbnRhY3RzKSB7XG4gICAgICBjdXJyZW50Q29udGFjdCA9IGN1cnJlbnRDb250YWN0c1swXVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIlRvIGJlIGNvbXBhcmVkIGN1cnJlbnRDb250YWN0IFwiLCBjdXJyZW50VXNlclR5cGVVc2VyKVxuXG4gICAgLy8gVW5zdWJzY3JpYmUgdG9CZVVwZGF0ZWRDb250YWN0IGZyb20gYWxsIGxpc3RzXG4gICAgdG9CZVVwZGF0ZWRVc2VyLmxpc3RzID0gWycnXVxuXG4gICAgY29uc29sZS5sb2coXCJrZXlUeXBlIFwiLCBrZXlUeXBlKVxuXG4gICAgdmFyIHVwZGF0ZVJlc3BvbnNlXG4gICAgaWYgKGtleVR5cGUgPT09IFwicGFydGl0aW9uLWtleVwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImluIHBhcnRpdGlvbiBrZXkgXCIsIGtleVR5cGUpXG5cbiAgICAgIHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQ29udGFjdEJ5UGFydGl0aW9uS2V5KGtleSwga2V5VHlwZSwgY3VycmVudFVzZXJUeXBlVXNlciwgdG9CZVVwZGF0ZWRVc2VyKVxuICAgIH0gZWxzZSBpZiAoa2V5VHlwZSA9PSBcInNvcnQta2V5XCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiaW4gc29ydCBrZXkgXCIsIGtleVR5cGUpXG5cbiAgICAgIHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQ29udGFjdEJ5U29ydEtleShrZXksIGtleVR5cGUsIGN1cnJlbnRVc2VyVHlwZVVzZXIsIHRvQmVVcGRhdGVkVXNlcilcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZVJlc3BvbnNlXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZENvbnRhY3RTdWJzY3JpcHRpb25zKHNlYXJjaEtleTogYW55LCBsaXN0SWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IHNlYXJjaEtleVN0cmluZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VhcmNoS2V5KSlcbiAgY29uc29sZS5sb2coXCJzZWFyY2hLZXkgaXMgXCIgKyBzZWFyY2hLZXlTdHJpbmcpXG4gIGNvbnN0IGtleSA9IHNlYXJjaEtleVN0cmluZy5rZXlcbiAgY29uc3Qga2V5VHlwZSA9IHNlYXJjaEtleVN0cmluZy50eXBlXG5cbiAgY29uc29sZS5sb2coXCJrZXkgaXMgXCIgKyBrZXkpXG4gIEN1c3RvbUxvZ2dlci5jdXN0b21Db250ZXh0TG9nZ2VyKFwia2V5VHlwZSBpcyBcIiwga2V5VHlwZSlcbiAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJsaXN0SWQgaXMgXCIsIGxpc3RJZClcblxuICBsZXQgcGFyYW1zXG4gIHZhciBjdXJyZW50VXNlclR5cGVVc2VyOiBVc2VyVHlwZSA9IHsgZW1haWw6IFwieEB4LmNvbVwiLCBjb250YWN0SWQ6IFwieFwiIH1cbiAgdmFyIHRvQmVVcGRhdGVkVXNlcjogVXNlclR5cGUgPSB7IGVtYWlsOiBcInhAeC5jb21cIiwgY29udGFjdElkOiBcInhcIiB9XG4gIHZhciBjdXJyZW50Q29udGFjdHM6IGFueSA9IFwiXCJcbiAgdmFyIGN1cnJlbnRDb250YWN0XG5cbiAgaWYgKGtleVR5cGUgPT0gXCJzb3J0LWtleVwiKSB7XG4gICAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJzZWFyY2hLZXkgdHlwZSBpcyBzb3J0IGtleSBcIiwga2V5KVxuICAgIGN1cnJlbnRDb250YWN0cyA9IGF3YWl0IHJldHJpZXZlQ29udGFjdEJ5RW1haWwoa2V5KVxuICAgIEN1c3RvbUxvZ2dlci5jdXN0b21Db250ZXh0TG9nZ2VyKFwiTnVtYmVyIG9mIGN1cnJlbnRDb250YWN0cyByZXR1cm5lZCBcIiwgY3VycmVudENvbnRhY3RzLmxlbmd0aClcblxuICB9IGVsc2UgaWYgKGtleVR5cGUgPT0gXCJwYXJ0aXRpb24ta2V5XCIpIHtcbiAgICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcInNlYXJjaEtleSB0eXBlIGlzIHBhcnRpdGlvbiBrZXkgXCIsIGtleSlcbiAgICBjdXJyZW50Q29udGFjdHMgPSBhd2FpdCByZXRyaWV2ZUNvbnRhY3RCeUlkKGtleSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogQ29uc3RhbnRzLklOVEVSTkFMX0VSUk9SLFxuICAgICAgYm9keTogJ0lsbGVnYWwgYXJndW1lbnQgaW4gcmVxdWVzdCdcbiAgICB9XG4gIH1cblxuICBpZiAoa2V5VHlwZSA9PSBcInNvcnQta2V5XCIgfHwga2V5VHlwZSA9PSBcInBhcnRpdGlvbi1rZXlcIikge1xuICAgIGlmIChjdXJyZW50Q29udGFjdHMpIHtcbiAgICAgIGN1cnJlbnRDb250YWN0ID0gY3VycmVudENvbnRhY3RzWzBdXG4gICAgICBjdXJyZW50VXNlclR5cGVVc2VyLmZpcnN0TmFtZSA9IGN1cnJlbnRDb250YWN0WydmaXJzdE5hbWUnXVxuICAgICAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJURmlyc3QgTmFtZSBYWFhYWCAgXCIsIGN1cnJlbnRVc2VyVHlwZVVzZXIuZmlyc3ROYW1lKVxuICAgICAgY3VycmVudFVzZXJUeXBlVXNlci5sYXN0TmFtZSA9IGN1cnJlbnRDb250YWN0WydsYXN0TmFtZSddXG4gICAgICBjdXJyZW50VXNlclR5cGVVc2VyLmVtYWlsID0gY3VycmVudENvbnRhY3RbJ2VtYWlsJ11cbiAgICAgIGN1cnJlbnRVc2VyVHlwZVVzZXIuY29udGFjdElkID0gY3VycmVudENvbnRhY3RbJ2NvbnRhY3RJZCddXG4gICAgICBjdXJyZW50VXNlclR5cGVVc2VyLnBob25lID0gY3VycmVudENvbnRhY3RbJ3Bob25lJ11cbiAgICAgIGN1cnJlbnRVc2VyVHlwZVVzZXIubGlzdHMgPSBjdXJyZW50Q29udGFjdFsnbGlzdHMnXVxuICAgICAgY3VycmVudFVzZXJUeXBlVXNlci50YWdzID0gY3VycmVudENvbnRhY3RbJ3RhZ3MnXVxuICAgICAgY3VycmVudFVzZXJUeXBlVXNlci5jdXN0b21GaWVsZHMgPSBjdXJyZW50Q29udGFjdFsnY3VzdG9tRmllbGRzJ11cbiAgICAgIGN1cnJlbnRVc2VyVHlwZVVzZXIub3duZXIgPSBjdXJyZW50Q29udGFjdFsnb3duZXInXVxuICAgIH1cbiAgICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcIlRvIGJlIGNvbXBhcmVkIGN1cnJlbnRDb250YWN0IFwiLCBjdXJyZW50VXNlclR5cGVVc2VyKVxuXG4gICAgY29uc3QgbGlzdFZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZUlmVXNlcklzQWxyZWFkeVN1YnNjcmliZWQobGlzdElkLCBjdXJyZW50VXNlclR5cGVVc2VyKVxuICAgIC8vIFZhbGlkYXRpb24gY2hlY2sgYW5kIHNlbmQgZXJyb3IgcmVzcG9uc2Ugd2hlcmUgdGhlIGV4aXN0aW5nIHVzZXIgaXMgYWxyZWFkeSBzdWJzY3JpYmVkIHRvIHRoaXMgbGlzdFxuICAgIGlmIChsaXN0VmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobGlzdFZhbGlkYXRpb25FcnJvcnNbMF0pXG4gICAgfVxuXG5cbiAgICB0b0JlVXBkYXRlZFVzZXIgPSBhcHBlbmRMaXN0VG9CZVVwZGF0ZWQoY3VycmVudFVzZXJUeXBlVXNlciwgdG9CZVVwZGF0ZWRVc2VyLCBsaXN0SWQpXG4gICAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJrZXlUeXBlIFwiLCBrZXlUeXBlKVxuXG4gICAgdmFyIHVwZGF0ZVJlc3BvbnNlXG4gICAgaWYgKGtleVR5cGUgPT09IFwicGFydGl0aW9uLWtleVwiKSB7XG4gICAgICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcImluIHBhcnRpdGlvbiBrZXkgXCIsIGtleVR5cGUpXG5cbiAgICAgIHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQ29udGFjdEJ5UGFydGl0aW9uS2V5KGtleSwga2V5VHlwZSwgY3VycmVudFVzZXJUeXBlVXNlciwgdG9CZVVwZGF0ZWRVc2VyKVxuICAgIH0gZWxzZSBpZiAoa2V5VHlwZSA9PSBcInNvcnQta2V5XCIpIHtcbiAgICAgIEN1c3RvbUxvZ2dlci5jdXN0b21Db250ZXh0TG9nZ2VyKFwiaW4gc29ydCBrZXkgXCIsIGtleVR5cGUpXG5cbiAgICAgIHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQ29udGFjdEJ5U29ydEtleShrZXksIGtleVR5cGUsIGN1cnJlbnRVc2VyVHlwZVVzZXIsIHRvQmVVcGRhdGVkVXNlcilcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZVJlc3BvbnNlXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNvbnRhY3RTdWJzY3JpcHRpb25zKHNlYXJjaEtleTogYW55LCBsaXN0SWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IHNlYXJjaEtleVN0cmluZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VhcmNoS2V5KSlcbiAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJzZWFyY2hLZXkgaXMgXCIsIHNlYXJjaEtleVN0cmluZylcbiAgY29uc3Qga2V5ID0gc2VhcmNoS2V5U3RyaW5nLmtleVxuICBjb25zdCBrZXlUeXBlID0gc2VhcmNoS2V5U3RyaW5nLnR5cGVcblxuICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcImtleSBpcyBcIiwga2V5KVxuICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcImtleVR5cGUgaXMgXCIsIGtleVR5cGUpXG4gIEN1c3RvbUxvZ2dlci5jdXN0b21Db250ZXh0TG9nZ2VyKFwibGlzdElkIGlzIFwiLCBsaXN0SWQpXG5cbiAgdmFyIGN1cnJlbnRVc2VyVHlwZVVzZXI6IFVzZXJUeXBlID0geyBlbWFpbDogXCJ4QHguY29tXCIsIGNvbnRhY3RJZDogXCJ4XCIgfVxuICB2YXIgdG9CZVVwZGF0ZWRVc2VyOiBVc2VyVHlwZSA9IHsgZW1haWw6IFwieEB4LmNvbVwiLCBjb250YWN0SWQ6IFwieFwiIH1cbiAgdmFyIGN1cnJlbnRDb250YWN0czogYW55ID0gXCJcIlxuICB2YXIgY3VycmVudENvbnRhY3RcblxuICBpZiAoa2V5VHlwZSA9PSBcInNvcnQta2V5XCIpIHtcbiAgICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcInNlYXJjaEtleSB0eXBlIGlzIHNvcnQga2V5IFwiLCBrZXkpXG4gICAgY3VycmVudENvbnRhY3RzID0gYXdhaXQgcmV0cmlldmVDb250YWN0QnlFbWFpbChrZXkpXG5cbiAgfSBlbHNlIGlmIChrZXlUeXBlID09IFwicGFydGl0aW9uLWtleVwiKSB7XG4gICAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJzZWFyY2hLZXkgdHlwZSBpcyBwYXJ0aXRpb24ga2V5IFwiLCBrZXkpXG4gICAgY3VycmVudENvbnRhY3RzID0gYXdhaXQgcmV0cmlldmVDb250YWN0QnlJZChrZXkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IENvbnN0YW50cy5JTlRFUk5BTF9FUlJPUixcbiAgICAgIGJvZHk6ICdJbGxlZ2FsIGFyZ3VtZW50IGluIHJlcXVlc3QnXG4gICAgfVxuICB9XG4gIGlmIChrZXlUeXBlID09IFwic29ydC1rZXlcIiB8fCBrZXlUeXBlID09IFwicGFydGl0aW9uLWtleVwiKSB7XG4gICAgaWYgKGN1cnJlbnRDb250YWN0cykge1xuICAgICAgY3VycmVudENvbnRhY3QgPSBjdXJyZW50Q29udGFjdHNbMF1cbiAgICAgIGN1cnJlbnRVc2VyVHlwZVVzZXIuZmlyc3ROYW1lID0gY3VycmVudENvbnRhY3RbJ2ZpcnN0TmFtZSddXG4gICAgICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcIlRGaXJzdCBOYW1lIFhYWFhYICBcIiwgY3VycmVudFVzZXJUeXBlVXNlci5maXJzdE5hbWUpXG4gICAgICBjdXJyZW50VXNlclR5cGVVc2VyLmxhc3ROYW1lID0gY3VycmVudENvbnRhY3RbJ2xhc3ROYW1lJ11cbiAgICAgIGN1cnJlbnRVc2VyVHlwZVVzZXIuZW1haWwgPSBjdXJyZW50Q29udGFjdFsnZW1haWwnXVxuICAgICAgY3VycmVudFVzZXJUeXBlVXNlci5jb250YWN0SWQgPSBjdXJyZW50Q29udGFjdFsnY29udGFjdElkJ11cbiAgICAgIGN1cnJlbnRVc2VyVHlwZVVzZXIucGhvbmUgPSBjdXJyZW50Q29udGFjdFsncGhvbmUnXVxuICAgICAgY3VycmVudFVzZXJUeXBlVXNlci5saXN0cyA9IGN1cnJlbnRDb250YWN0WydsaXN0cyddXG4gICAgICBjdXJyZW50VXNlclR5cGVVc2VyLnRhZ3MgPSBjdXJyZW50Q29udGFjdFsndGFncyddXG4gICAgICBjdXJyZW50VXNlclR5cGVVc2VyLmN1c3RvbUZpZWxkcyA9IGN1cnJlbnRDb250YWN0WydjdXN0b21GaWVsZHMnXVxuICAgICAgY3VycmVudFVzZXJUeXBlVXNlci5vd25lciA9IGN1cnJlbnRDb250YWN0Wydvd25lciddXG4gICAgfVxuICAgIEN1c3RvbUxvZ2dlci5jdXN0b21Db250ZXh0TG9nZ2VyKFwiVG8gYmUgY29tcGFyZWQgY3VycmVudENvbnRhY3QgXCIsIGN1cnJlbnRVc2VyVHlwZVVzZXIpXG5cblxuICAgIGNvbnN0IGxpc3RWYWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGVMaXN0U3Vic2NyaWJlZChsaXN0SWQsIGN1cnJlbnRVc2VyVHlwZVVzZXIpXG4gICAgLy8gVmFsaWRhdGlvbiBjaGVjayBhbmQgc2VuZCBlcnJvciByZXNwb25zZSB3aGVyZSB0aGUgZXhpc3RpbmcgdXNlciBpcyBhbHJlYWR5IHN1YnNjcmliZWQgdG8gdGhpcyBsaXN0XG4gICAgaWYgKGxpc3RWYWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihsaXN0VmFsaWRhdGlvbkVycm9yc1swXSlcbiAgICB9XG5cbiAgICB0b0JlVXBkYXRlZFVzZXIgPSBkZWxldGVMaXN0VG9CZVVwZGF0ZWQoY3VycmVudFVzZXJUeXBlVXNlciwgdG9CZVVwZGF0ZWRVc2VyLCBsaXN0SWQpXG4gICAgQ3VzdG9tTG9nZ2VyLmN1c3RvbUNvbnRleHRMb2dnZXIoXCJrZXlUeXBlIFwiLCBrZXlUeXBlKVxuXG4gICAgdmFyIHVwZGF0ZVJlc3BvbnNlXG4gICAgaWYgKGtleVR5cGUgPT09IFwicGFydGl0aW9uLWtleVwiKSB7XG4gICAgICBDdXN0b21Mb2dnZXIuY3VzdG9tQ29udGV4dExvZ2dlcihcImluIHBhcnRpdGlvbiBrZXkgXCIsIGtleVR5cGUpXG5cbiAgICAgIHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQ29udGFjdEJ5UGFydGl0aW9uS2V5KGtleSwga2V5VHlwZSwgY3VycmVudFVzZXJUeXBlVXNlciwgdG9CZVVwZGF0ZWRVc2VyKVxuICAgIH0gZWxzZSBpZiAoa2V5VHlwZSA9PSBcInNvcnQta2V5XCIpIHtcbiAgICAgIEN1c3RvbUxvZ2dlci5jdXN0b21Db250ZXh0TG9nZ2VyKFwiaW4gc29ydCBrZXkgXCIsIGtleVR5cGUpXG5cbiAgICAgIHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQ29udGFjdEJ5U29ydEtleShrZXksIGtleVR5cGUsIGN1cnJlbnRVc2VyVHlwZVVzZXIsIHRvQmVVcGRhdGVkVXNlcilcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZVJlc3BvbnNlXG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwZW5kTGlzdFRvQmVVcGRhdGVkKGN1cnJlbnRVc2VyVHlwZVVzZXI6IFVzZXJUeXBlLCB0b0JlVXBkYXRlZFVzZXI6IFVzZXJUeXBlLCBsaXN0SWQ6IHN0cmluZyk6IFVzZXJUeXBlIHtcbiAgdG9CZVVwZGF0ZWRVc2VyLmNvbnRhY3RJZCA9IGN1cnJlbnRVc2VyVHlwZVVzZXIuY29udGFjdElkXG4gIHRvQmVVcGRhdGVkVXNlci5jdXN0b21GaWVsZHMgPSBjdXJyZW50VXNlclR5cGVVc2VyLmN1c3RvbUZpZWxkc1xuICB0b0JlVXBkYXRlZFVzZXIuZW1haWwgPSBjdXJyZW50VXNlclR5cGVVc2VyLmVtYWlsXG4gIHRvQmVVcGRhdGVkVXNlci5maXJzdE5hbWUgPSBjdXJyZW50VXNlclR5cGVVc2VyLmZpcnN0TmFtZVxuICB0b0JlVXBkYXRlZFVzZXIubGFzdE5hbWUgPSBjdXJyZW50VXNlclR5cGVVc2VyLmxhc3ROYW1lXG4gIHRvQmVVcGRhdGVkVXNlci5vd25lciA9IGN1cnJlbnRVc2VyVHlwZVVzZXIub3duZXJcbiAgdG9CZVVwZGF0ZWRVc2VyLnBob25lID0gY3VycmVudFVzZXJUeXBlVXNlci5waG9uZVxuICB0b0JlVXBkYXRlZFVzZXIudGFncyA9IGN1cnJlbnRVc2VyVHlwZVVzZXIudGFnc1xuXG4gIGlmIChjdXJyZW50VXNlclR5cGVVc2VyLmxpc3RzKSB7XG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgY3VycmVudCBsaXN0XG4gICAgY29uc3QgY3VycmVudExpc3Q6IFtzdHJpbmddID0gWy4uLmN1cnJlbnRVc2VyVHlwZVVzZXIubGlzdHNdXG5cbiAgICAvLyBBcHBlbmQgdGhlIG5ldyBsaXN0SWQgdG8gdGhlIGN1cnJlbnQgbGlzdFxuICAgIGN1cnJlbnRMaXN0LnB1c2gobGlzdElkKVxuXG4gICAgLy8gVXBkYXRlIHRoZSBsaXN0cyBwcm9wZXJ0eSBpbiB0b0JlVXBkYXRlZFVzZXJcbiAgICB0b0JlVXBkYXRlZFVzZXIubGlzdHMgPSBjdXJyZW50TGlzdFxuICB9IGVsc2Uge1xuICAgIC8vIElmIGN1cnJlbnRVc2VyVHlwZVVzZXIubGlzdHMgaXMgdW5kZWZpbmVkLCBpbml0aWFsaXplIGl0IGFzIGEgbmV3IGFycmF5XG4gICAgdG9CZVVwZGF0ZWRVc2VyLmxpc3RzID0gW2xpc3RJZF1cbiAgfVxuXG4gIHJldHVybiB0b0JlVXBkYXRlZFVzZXJcblxufVxuXG5mdW5jdGlvbiB1cGRhdGVDb250YWN0QnlQYXJ0aXRpb25LZXkoa2V5OiBzdHJpbmcsIGtleVR5cGU6IHN0cmluZywgY3VycmVudFVzZXJUeXBlVXNlcjogVXNlclR5cGUsIHRvQmVVcGRhdGVkVXNlcjogVXNlclR5cGUpOiBhbnkge1xuICByZXR1cm4gdXBkYXRlQ29udGFjdEJ5SWQoa2V5LCBjdXJyZW50VXNlclR5cGVVc2VyLCB0b0JlVXBkYXRlZFVzZXIpXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbnRhY3RCeVNvcnRLZXkoa2V5OiBzdHJpbmcsIGtleVR5cGU6IHN0cmluZywgY3VycmVudFVzZXJUeXBlVXNlcjogVXNlclR5cGUsIHRvQmVVcGRhdGVkVXNlcjogVXNlclR5cGUpOiBhbnkge1xuICByZXR1cm4gdXBkYXRlQ29udGFjdEJ5RW1haWwoa2V5LCBjdXJyZW50VXNlclR5cGVVc2VyLCB0b0JlVXBkYXRlZFVzZXIpXG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUxpc3RUb0JlVXBkYXRlZChjdXJyZW50VXNlclR5cGVVc2VyOiBVc2VyVHlwZSwgdG9CZVVwZGF0ZWRVc2VyOiBVc2VyVHlwZSwgbGlzdElkOiBzdHJpbmcpOiBVc2VyVHlwZSB7XG4gIHRvQmVVcGRhdGVkVXNlci5jb250YWN0SWQgPSBjdXJyZW50VXNlclR5cGVVc2VyLmNvbnRhY3RJZFxuICB0b0JlVXBkYXRlZFVzZXIuY3VzdG9tRmllbGRzID0gY3VycmVudFVzZXJUeXBlVXNlci5jdXN0b21GaWVsZHNcbiAgdG9CZVVwZGF0ZWRVc2VyLmVtYWlsID0gY3VycmVudFVzZXJUeXBlVXNlci5lbWFpbFxuICB0b0JlVXBkYXRlZFVzZXIuZmlyc3ROYW1lID0gY3VycmVudFVzZXJUeXBlVXNlci5maXJzdE5hbWVcbiAgdG9CZVVwZGF0ZWRVc2VyLmxhc3ROYW1lID0gY3VycmVudFVzZXJUeXBlVXNlci5sYXN0TmFtZVxuICB0b0JlVXBkYXRlZFVzZXIub3duZXIgPSBjdXJyZW50VXNlclR5cGVVc2VyLm93bmVyXG4gIHRvQmVVcGRhdGVkVXNlci5waG9uZSA9IGN1cnJlbnRVc2VyVHlwZVVzZXIucGhvbmVcbiAgdG9CZVVwZGF0ZWRVc2VyLnRhZ3MgPSBjdXJyZW50VXNlclR5cGVVc2VyLnRhZ3NcblxuXG4gIGlmIChjdXJyZW50VXNlclR5cGVVc2VyLmxpc3RzICYmIGN1cnJlbnRVc2VyVHlwZVVzZXIubGlzdHMubGVuZ3RoID4gMCkge1xuICAgIC8vIEZpbHRlciBvdXQgdGhlIGxpc3RJZCBmcm9tIHRoZSBjdXJyZW50IGxpc3RcbiAgICBjb25zdCB1cGRhdGVkTGlzdCA9IGN1cnJlbnRVc2VyVHlwZVVzZXIubGlzdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gbGlzdElkKVxuXG4gICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSB1cGRhdGVkIGxpc3QgaXMgZW1wdHlcbiAgICBpZiAodXBkYXRlZExpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICB0b0JlVXBkYXRlZFVzZXIubGlzdHMgPSBbXSBhcyB1bmtub3duIGFzIFtzdHJpbmddIC8vIENhc3QgdG8gW3N0cmluZ10gdG8gc2F0aXNmeSB0aGUgdHlwZSByZXF1aXJlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGVyZSdzIGF0IGxlYXN0IG9uZSBlbGVtZW50LCB3ZSBjYW4gc2FmZWx5IGFzc2lnbiBpdFxuICAgICAgdG9CZVVwZGF0ZWRVc2VyLmxpc3RzID0gdXBkYXRlZExpc3QgYXMgW3N0cmluZ10gLy8gVGhpcyBjYXN0IG1pZ2h0IGJlIHVuc2FmZSBpZiB1cGRhdGVkTGlzdCBoYXMgbW9yZSB0aGFuIG9uZSBlbGVtZW50XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIGN1cnJlbnRVc2VyVHlwZVVzZXIubGlzdHMgaXMgdW5kZWZpbmVkIG9yIGVtcHR5LCB0aGVyZSdzIG5vdGhpbmcgdG8gZGVsZXRlXG4gICAgdG9CZVVwZGF0ZWRVc2VyLmxpc3RzID0gW10gYXMgdW5rbm93biBhcyBbc3RyaW5nXSAvLyBDYXN0IHRvIFtzdHJpbmddXG4gIH1cblxuICByZXR1cm4gdG9CZVVwZGF0ZWRVc2VyXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGVtYWlsRXhpc3RzSW5EYXRhYmFzZShlbWFpbDogc3RyaW5nKSB7XG4gIHZhciBlbWFpbEV4aXN0cyA9IGZhbHNlXG4gIHZhciBpdGVtcyA9IGF3YWl0IHJldHJpZXZlQ29udGFjdEJ5RW1haWwoZW1haWwpXG5cbiAgaWYgKGl0ZW1zICE9IG51bGwgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xuICAgIGVtYWlsRXhpc3RzID0gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIGVtYWlsRXhpc3RzID0gZmFsc2VcbiAgfVxuICByZXR1cm4gZW1haWxFeGlzdHNcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29udGFjdElkRXhpc3RzSW5EYXRhYmFzZShjb250YWN0SWQ6IHN0cmluZykge1xuICB2YXIgY29udGFjdElkRXhpc3RzID0gZmFsc2VcbiAgdmFyIGl0ZW1zID0gYXdhaXQgcmV0cmlldmVDb250YWN0QnlJZChjb250YWN0SWQpXG5cbiAgaWYgKGl0ZW1zICE9IG51bGwgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnRhY3RJZEV4aXN0cyA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICBjb250YWN0SWRFeGlzdHMgPSBmYWxzZVxuICB9XG4gIHJldHVybiBjb250YWN0SWRFeGlzdHNcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVJZlVzZXJJc0FscmVhZHlTdWJzY3JpYmVkKGxpc3RJZDogc3RyaW5nLCBjdXJyZW50Q29udGFjdDogVXNlclR5cGUpIHtcbiAgY29uc3QgY3VycmVudExpc3RzID0gY3VycmVudENvbnRhY3QubGlzdHNcblxuICBpZiAoY3VycmVudExpc3RzKSB7XG4gICAgLy8gQ2hlY2sgaWYgbGlzdElkIGV4aXN0cyBpbiBjdXJyZW50TGlzdHNcbiAgICBpZiAoY3VycmVudExpc3RzLmluY2x1ZGVzKGxpc3RJZCkpIHtcbiAgICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yIC0gVXNlciBhbHJlYWR5IHN1YnNjcmliZWQgdG8gdGhlIGxpc3RcIl1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGlzdFN1YnNjcmliZWQobGlzdElkOiBzdHJpbmcsIGN1cnJlbnRDb250YWN0OiBVc2VyVHlwZSkge1xuICBjb25zdCBjdXJyZW50TGlzdHMgPSBjdXJyZW50Q29udGFjdC5saXN0c1xuXG4gIGlmIChjdXJyZW50TGlzdHMpIHtcbiAgICAvLyBDaGVjayBpZiBsaXN0SWQgZXhpc3RzIGluIGN1cnJlbnRMaXN0c1xuICAgIGlmICghY3VycmVudExpc3RzLmluY2x1ZGVzKGxpc3RJZCkpIHtcbiAgICAgIHJldHVybiBbXCJWYWxpZGF0aW9uIEVycm9yXCIsIFwiVXNlciBub3QgY3VycmVudGx5IHN1YnNjcmliZWQgdG8gdGhlIGxpc3RcIl1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtdXG5cbn1cbiovXG4iXX0=