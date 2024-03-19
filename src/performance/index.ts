import { ReportTracker } from '../types/performance';
import {ResourceFlow} from './resource'
import {loadingData} from './loading'
export default class PerformanceTracker {
  private reportTracker: ReportTracker;
  private performanceData:object;
  constructor(reportTracker: ReportTracker) {
    this.reportTracker = reportTracker;

  }
  public performanceEvent() {
    // window.addEventListener('load', () => {
    //   setTimeout(() => {
       
    //   }, 3000);
    // });
    this.getResouceFlow()
    this.getloading()
  }
  /**
   * 获取dom流
   *
   */
  public getResouceFlow(){
    const reuslt = ResourceFlow()
    // console.log(reuslt,"result,ressult")
  }
    /**
   * 获取各类loading时间
   *
   */
  public getloading(){
    const result = loadingData()
    // console.log(result,"resultresultresultresultresultresultresult")
  }
}
