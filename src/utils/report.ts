import * as AWS from 'aws-sdk';
const s3 = new AWS.S3();
import * as Constants from '../utils/constants'

AWS.config.update({ region: Constants.AWS_REGION })

interface Note {
    id: number;
    content: string;
}

interface Report {
    projectUpdates: string[];
    actionsAndFollowUps: string[];
}

export function generateReport(notes: Note[]): Report {
    const report: Report = { projectUpdates: [], actionsAndFollowUps: [] };

    notes.forEach(note => {
        if (note.content.includes("update") || note.content.includes("track")) {
            report.projectUpdates.push(note.content);
        } else if (note.content.includes("Remind me") || note.content.includes("Send")) {
            report.actionsAndFollowUps.push(note.content);
        }
    });

    return report;
}

export function printReport(report: Report): void {
    console.log("Project Updates:");
    report.projectUpdates.forEach(update => console.log(`- ${update}`));
    console.log("\nActions and Follow-Ups:");
    report.actionsAndFollowUps.forEach(action => console.log(`- ${action}`));
}

export async function uploadReportToS3(bucketName: string, report: Report): Promise<string> {
    const reportContent = JSON.stringify(report); // Convert report object to string
    const fileName = `report-${Date.now()}.json`; // A unique file name for the report

    console.log("Report JSON to upload:", fileName);
    console.log("Report Content to upload:", reportContent);

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: reportContent,
      ContentType: 'application/json'
    };
  
    try {
      const data = await s3.upload(params).promise();
      console.log('Report uploaded successfully:', data.Location);
      return data.Location; // Returns the URL to the uploaded report
    } catch (error) {
      console.error('Error uploading report to S3:', error);
      throw error;
    }
  }
  