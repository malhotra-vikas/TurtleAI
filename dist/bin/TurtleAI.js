#!/usr/bin/env node
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
const cdk = __importStar(require("aws-cdk-lib"));
const Constants = __importStar(require("../src/utils/constants"));
const TurtleAI_stack_1 = require("../lib/TurtleAI-stack");
const app = new cdk.App();
new TurtleAI_stack_1.TurtleAIStack(app, 'TurtleAIStack', {
    env: {
        account: Constants.AWS_ACCOUNT,
        region: Constants.AWS_REGION,
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVydGxlQUkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9iaW4vVHVydGxlQUkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpREFBa0M7QUFDbEMsa0VBQW1EO0FBRW5ELDBEQUFxRDtBQUVyRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUN6QixJQUFJLDhCQUFhLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUN0QyxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsU0FBUyxDQUFDLFdBQVc7UUFDOUIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVO0tBQzdCO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0ICogYXMgQ29uc3RhbnRzIGZyb20gJy4uL3NyYy91dGlscy9jb25zdGFudHMnXG5cbmltcG9ydCB7IFR1cnRsZUFJU3RhY2sgfSBmcm9tICcuLi9saWIvVHVydGxlQUktc3RhY2snXG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKClcbm5ldyBUdXJ0bGVBSVN0YWNrKGFwcCwgJ1R1cnRsZUFJU3RhY2snLCB7XG4gIGVudjoge1xuICAgIGFjY291bnQ6IENvbnN0YW50cy5BV1NfQUNDT1VOVCxcbiAgICByZWdpb246IENvbnN0YW50cy5BV1NfUkVHSU9OLFxuICB9XG59KVxuIl19