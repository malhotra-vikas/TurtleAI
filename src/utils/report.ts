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