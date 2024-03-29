import { ReportTracker } from '../types/performance';
import { ResourceFlow } from './resource';
import { loadingData } from './loading';
import { WebVitals } from './performance';
import { CacheData } from './cache';
export default class PerformanceTracker {
  private reportTracker: ReportTracker;
  private performanceData: object;
  constructor(reportTracker: ReportTracker) {
    this.reportTracker = reportTracker;
  }
  public performanceEvent() {
    // window.addEventListener('load', () => {
    //   setTimeout(() => {

    //   }, 3000);
    // });
    this.getResouceFlow();
    this.getloading();
    this.getWebVitals();
  }
  /**
   * 获取dom流
   *
   */
  public getResouceFlow() {
    const reuslt = ResourceFlow();
    // console.log(reuslt,"result,ressult")
  }
  /**
   * 获取各类loading时间
   *
   */
  public getloading() {
    const result = loadingData();
    // console.log(result,"resultresultresultresultresultresultresult")
  }
  /**
   * 获取WebVitals指标
   *
   */
  public getWebVitals() {
    const result = WebVitals();
    console.log(result);
  }
  /**
   * 获取缓存
   *
   */
  public getCache() {
    const result = CacheData();
  }
}
