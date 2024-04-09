import AWS = require('aws-sdk')
import * as Constants from "../utils/constants"
import * as CustomLogger from "../utils/turtleai-logger"

AWS.config.update({ region: Constants.AWS_REGION })
const dynamoDB = new AWS.DynamoDB.DocumentClient()

export async function createEntry(userEmail: string, timeStamp: number, entryType: string, employeeId: string, projectId: string, taskId: string, notes: string) {

    var entry = null

    console.log("User email", userEmail)
    console.log("Entry Type", entryType)

    // Add autoVerify and alertAdmin in case of a new Contact being created
    const params = {
        TableName: Constants.TEN_TEN_JOURNAL_TABLE,
        Item: {
            email: userEmail,
            timestamp: timeStamp,
            journaltype: entryType,
            entry: notes,
            relatedemployee: employeeId,
            relatedproject: projectId,
            relatedtask: taskId
        },
        ReturnConsumedCapacity: 'TOTAL',
        ReturnItemCollectionMetrics: 'SIZE'
    }
    try {

        console.log("Creating for params", params)

        const dynamodbData = await dynamoDB.put(params).promise()
        console.log("Created in table: " + Constants.TEN_TEN_JOURNAL_TABLE)

        return dynamodbData
    } catch (error) {
        console.log("Error", error)
        throw error
    }
}

export async function retrieveEntryByTimestamp(email: String, timeStamp: number) {
    let items;
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: Constants.TEN_TEN_JOURNAL_TABLE,
        KeyConditionExpression: "#email = :emailValue and #timeStamp = :timeStampValue",
        ExpressionAttributeNames: {
            "#email": "email",
            "#timeStamp": "timestamp"
        },
        ExpressionAttributeValues: {
            ":emailValue": email,
            ":timeStampValue": timeStamp
        }
    }

    // Perform the query on the DynamoDB table
    const result = await dynamoDB.query(params).promise()

    console.log("Items found " + JSON.stringify(result))
    items = result.Items || null

    return items;
}

export async function retrieveEntryByEmail(email: String) {
    let items;
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: Constants.TEN_TEN_JOURNAL_TABLE,
        KeyConditionExpression: "#email = :emailValue",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":emailValue": email
        }
    }

    // Perform the query on the DynamoDB table
    const result = await dynamoDB.query(params).promise()

    console.log("Items found " + JSON.stringify(result))
    items = result.Items || null

    return items;
}