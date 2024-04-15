# Turtle AI 

## Getting Started

### Prerequisites

- Install AWS CDK `npm i -g aws-cdk`
- Install the AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
- Notate the name of your profile
  - For example, in our /.aws/credentials file, we conventionally have a profile named `staging`.
  - When commands below reference `$PROFILE`, include `--profile staging`
- Clone the repo
- Run `npm install`
- copy `.env.example` to `.env`
  - Add the staging account number and region

#### AWS Objects

- AWS Pinpoint application is created and applicationId is copied to a text file
- applicationId is stored in resources/default.json and in utils/constants.ts
- Created application has the email channel enabled.
  - To enable the email channel, in the AWS Pinpoint console, go to Settings --> Email --> Identity details, click the Edit button and enable the email channel
- CDK stack script will create the segments, one for "marketing" and another for "clinical"
- If you need to delete a Pinpoint project, you can do it in the console in "Settings" and then "General Settings"

### Deploying

## Setting the Account ID & Pinpoint Application ID

Before you deploy, you should make sure the correct AWS account ID is included on line 1 of ```utils/constants.ts```. Next, you should make sure the PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION constant in the same file is set to the correct value for the environment you're deploying to:

The correct PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION value should also be set in ```resources/default.json```.

### CDK Deploy Command

`cdk deploy --profile $profile`

---

## User import

- Template CSV file is at template/uploadContacts.csv
- Bulk Upload/ Import works with the CSV file (uploadContacts.csv) being dropped at the S3 Bucket (bulk-upload-contacts)
- The bulkCreateContact Lambda reacts to this event, parses the file and uploads the contacts in the DynamoDB
- CDK does not support S3 creation and handling natively. So for now the S3 bucket creation and adding that as a trigger for the BulkCreate Lambda is manual.
- Steps to follow
  1. Deploy the code
  2. Create a S3 bucket (bulk-upload-contacts)
  3. Add a S3 trigger to the bulkCreateContactLambda for eventType "s3:ObjectCreated:*" and prefix "uploadContacts.csv"

You can also achieve the steps 1-3 by uncommenting the S3 creation code in the CDK. IT REQUIRES THAT THERE IS NO EXISTING S3 BUCKET BY THE NAME.

## Testing

- Run tests
- Ensure that the updated credentials are places in .aws/credentials file
- Notate the name of your profile
  - for example, in my /.aws/credentials file, there is a profile named `949858277727_PowerUserAccess`.

`AWS_PROFILE=949858277727_PowerUserAccess npm test --detectOpenHandles --verbose`

Include the Profile that is saved in

## Monitoring

### Health check endpoint

- Endpoint `/v1/ping` is responded to by /src/TurtleAI-lambda/index.ts

## Helpful Docs

- https://docs.aws.amazon.com/cdk/v2/guide/serverless_example.html
- https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html
- https://github.com/bobbyhadz/aws-cdk-api-gateway-example
- https://github.com/bobbyhadz/aws-cdk-lambda-layers

## Useful Guides

- [Chapter 1. AWS Pinpoint Segment Data Recovery Guide](#AWS-pinpoint-segment-data-recovery-guide)

### AWS Pinpoint Segment Data Recovery Guide

**Introduction :** Accidentally deleting a segment in AWS Pinpoint can be a frustrating experience, but there is a way to recover the lost data. This guide outlines the steps to retrieve a deleted segment effectively.

**Method:**

**1. Comment Out the Deleted Segment:**

- Open the AWS CDK (Cloud Development Kit) code where the deleted segment was defined.
- Locate the section of code responsible for defining the segment. In this example, we will refer to a segment named **marketing** defined in the **TurtleAI-stack.ts** file.

![Image of commented code](/images/1_commentedImage.png)

**2. Deploy the Code:**

- Use the following command to deploy your CDK code:
  `cdk deploy`
- Wait for the deployment to complete successfully.

**3. Uncomment the Deleted Segment:**

- Once the deployment is successful, go back to your CDK code.
- Uncomment the code for the "marketing" segment or the segment you deleted earlier.

![Image of uncommented code](/images/2_uncommentedImage.png)

**4. Deploy the Code Again:**

- Deploy your CDK code one more time to recover the deleted segment
  `cdk deploy`
- This will update your AWS Pinpoint configuration with the recovered segment.

**Understanding AWS Pinpoint Segments:**

It's important to note that when you create a segment in AWS Pinpoint, it doesn't actually create any new records. Instead, it queries the existing endpoints and creates a virtual segment based on matching criteria.
For example, if you create a **marketing** segment, Pinpoint scans all endpoints and assembles a collection of endpoints that match the criteria specified for the marketing segment.
