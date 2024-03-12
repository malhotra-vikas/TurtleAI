// constants.ts
export const AWS_ACCOUNT = "846708839800"
export const AWS_REGION = "us-east-2"

export const LAMBDA_ROLE = "LambdaRole"

//export const AWS_ACCOUNT = process.env.CDK_DEFAULT_ACCOUNT
//export const AWS_REGION = process.env.CDK_DEFAULT_REGION

// Since the Pinpoint is done manually. This needs to be updated for deployment - IF YOU ARE CREATING A NEW Pinpoint Project

// Production application ID = 2794595018b548c89e9ee4a88bba0b24
// Staging application ID = 9871c5e6bd70425bb81e0b1931b43f3f
// NOTE: This value MUST be consistent with the one in utils/constants.ts
export const PINPOINT_CONTACT_COMMUNICATIONS_APPLICATION = "c1eb640662a348bcb3e67835f1614451"

// AutoBuilds from the AWS Variables
export const ALERT_ADMIN_SNS_QUEUE = "arn:aws:sns:"+AWS_REGION+":"+AWS_ACCOUNT+":TurtleAI-ContactSNSTopic-AdminAlerts"
export const USER_VERIFICATION_SNS_QUEUE = "arn:aws:sns:"+AWS_REGION+":"+AWS_ACCOUNT+":TurtleAI-ContactSNSTopic-ContactVerification"
export const CONTACTS_TABLE_ARN = "arn:aws:dynamodb:"+AWS_REGION+":"+AWS_ACCOUNT+":table/TurtleAIContacts"
export const CONTACTS_VERIFICATION_TABLE_ARN = "arn:aws:dynamodb:"+AWS_REGION+":"+AWS_ACCOUNT+":table/TurtleAIContactsVerification"

// Contacts Table
export const CONTACTS_TABLE = "TurtleAIContacts"

// Ten Ten Resources
export const TEN_TEN_USERS_TABLE = "TenTenUsers"
export const TEN_TEN_EMPLOYEES_TABLE = "TenTenEmployees"
export const TEN_TEN_PROJECTS_TABLE = "TenTenProjects"
export const TEN_TEN_TASKS_TABLE = "TenTenTasks"
export const TEN_TEN_JOURNAL_TABLE = "TenTenJournal"

export const TEN_TEN_USERS_TABLE_ARN = "arn:aws:dynamodb:" + exports.AWS_REGION + ":" + exports.AWS_ACCOUNT + ":table/TenTenUsers";
export const TEN_TEN_EMPLOYEES_TABLE_ARN = "arn:aws:dynamodb:" + exports.AWS_REGION + ":" + exports.AWS_ACCOUNT + ":table/TenTenEmployees";
export const TEN_TEN_PROJECTS_TABLE_ARN = "arn:aws:dynamodb:" + exports.AWS_REGION + ":" + exports.AWS_ACCOUNT + ":table/TenTenProjects";
export const TEN_TEN_TASKS_TABLE_ARN = "arn:aws:dynamodb:" + exports.AWS_REGION + ":" + exports.AWS_ACCOUNT + ":table/TenTenTasks";
export const TEN_TEN_JOURNAL_TABLE_ARN = "arn:aws:dynamodb:" + exports.AWS_REGION + ":" + exports.AWS_ACCOUNT + ":table/TenTenJournal";

export const TEN_TEN_USERS_TABLE_PARTITION_KEY = 'email'
export const TEN_TEN_USERS_TABLE_SORT_KEY = 'name'

export const TEN_TEN_CREATE_USER_LAMBDA = "TenTenCreateUsersLambda"
export const TEN_TEN_RETRIEVE_USER_LAMBDA = "TenTenRetrieveUsersLambda"
export const TEN_TEN_CREATE_JOURNAL_ENTRY_LAMBDA = "TenTenCreateJournalEntryLambda"


export const TEN_TEN_USERS_TABLE_NAME_IDX = 'NameIndex'


// Ten Ten Resources


export const CONTACTS_TABLE_SORT_KEY = 'email'
export const CONTACTS_TABLE_PARTITION_KEY = 'contactId'
export const CONTACTS_TABLE_CONTACTID_IDX = 'ContactIdIndex'
export const CONTACTS_TABLE_EMAIL_IDX = 'EmailIndex'

// S3 Bucket
export const BULK_UPLOAD_BUCKET = 'bulk-upload-contacts'
export const BULK_UPLOAD_CSV = 'uploadContacts.csv'

// Contacts Verification Table
export const CONTACTS_VERIFICATION_TABLE = "TurtleAIContactsVerification"
export const CONTACTS_VERIFICATION_TABLE_SORT_KEY = 'contactId'
export const CONTACTS_VERIFICATION_TABLE_PARTITION_KEY = 'contactVerificationId'
//export const CONTACTS_VERIFICATION_TABLE_CONTACTID_IDX = 'ContactIdIndex'
//export const CONTACTS_VERIFICATION_TABLE_EMAIL_IDX = 'EmailIndex'

export const CREATE_CONTACTS_LAMBDA = "createContactLambda"
export const RETRIEVE_CONTACTS_LAMBDA = "fetchContactLambda"
export const UPDATE_CONTACTS_LAMBDA = "updateContactLambda"
export const UPDATE_CONTACT_SUBSCRIPTION_LAMBDA = "updateContactSubscriptionsLambda"
export const BULK_CREATE_CONTACTS_LAMBDA = "bulkCreateContactLambda"

export const SUCCESS = 200
export const ERROR = 400
export const DOES_NOT_EXIST = 404
export const INTERNAL_ERROR = 500

export const POST = 'POST'
export const DELETE = 'DELETE'
export const GET = 'GET'
export const PUT = 'PUT'

// Source of Contacts being created
export const WEB_LEAD = "web-lead"
export const BULK_UPLOAD = "bulk-upload"