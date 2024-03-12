import * as AWS from 'aws-sdk'


async function getSecret(client: AWS.SecretsManager, secretArn: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretArn }, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      if ('SecretString' in data) {
        resolve(data.SecretString as string)
      } else {
        resolve(Buffer.from(data.SecretBinary as any, 'base64').toString('ascii'))
      }
    })
  })
}

export const awsUtils = { getSecret }