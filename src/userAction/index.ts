import { blankScreenTracker } from './blankScreen'
import { ReportTracker } from '../types/error';
export class userAction {
    private reportTracker: ReportTracker;
    constructor(reportTracker: ReportTracker) {
        this.reportTracker = reportTracker
    }

    public eventTracker() {
        this.blankScreen()
    }

    public blankScreen() {
        new blankScreenTracker(this.reportTracker)
    }
}