import { BlankScreenTracker } from './BlankScreen'
import { ReportTracker } from '../types/error';
import targetKeyReport from './Dom'
export class userAction {
    private reportTracker: ReportTracker;
    constructor(reportTracker: ReportTracker) {
        this.reportTracker = reportTracker
    }

    public eventTracker() {
        this.blankScreen()
    }

    public blankScreen() {
        new BlankScreenTracker(this.reportTracker)
    }
    public Dom() {
        targetKeyReport(this.reportTracker)
    }
}