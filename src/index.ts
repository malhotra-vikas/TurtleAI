import { UserType } from './utils/user'

const region = 'us-east-1'

const localTestCases = process.env.RUNNING_LOCAL_TESTS

const response = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'application/json'
  },
  isBase64Encoded: false,
  body: ''
}

async function convertBodyToUser(body: string): Promise<UserType> {

  if (localTestCases == 'yes') {
    const parsedBody = JSON.parse(body)

    return {
      email: parsedBody["email"],
      firstName: parsedBody["firstName"],
      lastName: parsedBody['lastName'],
      phone: parsedBody['phone'],
      lists: parsedBody['lists'],
      tags: parsedBody['tags'],
      customFields: parsedBody['customFields'],
      verified: parsedBody['verified']
    }
  } else {
    return {
      //@ts-ignore
      email: body['email'],
      //@ts-ignore
      firstName: body['firstName'],
      //@ts-ignore
      lastName: body['lastName'],
      //@ts-ignore
      phone: body['phone'],
      //@ts-ignore
      lists: body['lists'],
      //@ts-ignore
      tags: body['tags'],
      //@ts-ignore
      customFields: body['customFields'],
      //@ts-ignore
      verified: body['verified']
    }
  }
}


export async function readUserFromUpdateEvent(body: string): Promise<UserType> {
  console.log("in readUserFromUpdateEvent " + body)
  const contact: UserType = JSON.parse(body)

  if (localTestCases == 'yes') {
    //const parsedBody = JSON.parse(body)
    //console.log("in readUserFromUpdateEvent " + parsedBody)

    return {
      contactId: contact.contactId,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      lists: contact.lists,
      tags: contact.tags,
      customFields: contact.customFields,
      verified: contact.verified,
      owner: contact.owner,
    }
  } else {
    return {
      //@ts-ignore
      contactId: body['contactId'],
      //@ts-ignore
      email: body['email'],
      //@ts-ignore
      firstName: body['firstName'],
      //@ts-ignore
      lastName: body['lastName'],
      //@ts-ignore
      phone: body['phone'],
      //@ts-ignore
      lists: body['lists'],
      //@ts-ignore
      tags: body['tags'],
      //@ts-ignore
      customFields: body['customFields'],
      //@ts-ignore
      verified: body['verified'],
      //@ts-ignore
      owner: body['owner'],

    }
  }
}

export async function readUserFromEvent(body: string): Promise<UserType> {
  if (localTestCases == 'yes') {
    //const parsedBody = JSON.parse(body)
    const parsedBody = JSON.parse(body)
    console.log(parsedBody)

    return {
      contactId: parsedBody["contactId"],
      email: parsedBody["email"],
      firstName: parsedBody["firstName"],
      lastName: parsedBody['lastName'],
      phone: parsedBody['phone'],
      lists: parsedBody['lists'],
      tags: parsedBody['tags'],
      customFields: parsedBody['customFields'],
      verified: parsedBody['verified'],
      owner: parsedBody['owner'],
      message: parsedBody['message']
    }
  } else {
    const parsedBody = JSON.parse(body)
    console.log(parsedBody)

    return {
      //@ts-ignore
      contactId: parsedBody["contactId"],
      //@ts-ignore
      email: parsedBody["email"],
      //@ts-ignore
      firstName: parsedBody["firstName"],
      //@ts-ignore
      lastName: parsedBody['lastName'],
      //@ts-ignore
      phone: parsedBody['phone'],
      //@ts-ignore
      lists: parsedBody['lists'],
      //@ts-ignore
      tags: parsedBody['tags'],
      //@ts-ignore
      customFields: parsedBody['customFields'],
      //@ts-ignore
      verified: parsedBody['verified'],
      //@ts-ignore
      owner: parsedBody['owner'],
      message: parsedBody['message']
    }
  }
}

export async function readQueryParamsFromEvent(body: string) {
  if (localTestCases == 'yes') {
    const parsedBody = JSON.parse(body)

    return {
      email: parsedBody["email"],
      contactId: parsedBody["contactId"]
    }
  } else {
    return {
      //@ts-ignore
      email: body['email'],
      //@ts-ignore
      contactId: body['contactId']
    }
  }
}
