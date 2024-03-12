#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import * as Constants from '../src/utils/constants'

import { TurtleAIStack } from '../lib/TurtleAI-stack'

const app = new cdk.App()
new TurtleAIStack(app, 'TurtleAIStack', {
  env: {
    account: Constants.AWS_ACCOUNT,
    region: Constants.AWS_REGION,
  }
})
