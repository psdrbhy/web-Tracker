import { resourceFlow } from './resourceFlow';
import { loadingData } from './loading';
import { WebVitals } from './performance';
import { cache } from './cache';
import { type ReportTracker } from '../types/performance';
import {
  type ResourceFlow,
  type LoadingData,
  type CatchData,
  type MetricData,
} from '../types/performance';
export default class PerformanceTracker {
  private reportTracker: ReportTracker;
  private performanceData: object;
  private resouceFlowData: ResourceFlow[];
  private loadingData: LoadingData;
  private catchData: CatchData;
  private webVitalData: MetricData;
  constructor(reportTracker: ReportTracker) {
    this.reportTracker = reportTracker;
    this.performanceEvent();
  }
  public performanceEvent() {
    this.getResouceFlow();
    this.getloading();
    this.getWebVitals();
    this.getCache();
    this.reportPerformance();
  }
  /**
   * 获取dom流
   *
   */
  public getResouceFlow() {
    this.resouceFlowData = resourceFlow();
  }
  /**
   * 获取各类loading时间
   *
   */
  public getloading() {
    this.loadingData = loadingData();
  }
  /**
   * 获取WebVitals指标
   *
   */
  public getWebVitals() {
    // this.webVital = WebVitals();
    // console.log(this.webVital);
  }
  /**
   * 获取缓存
   *
   */
  public getCache() {
    this.catchData = cache();
    // console.log( this.catchData, 'resultresultresultresultresultresult');
  }

  public reportPerformance() {
    // 将所有数据集中起来

    this.performanceData = {
      catchData: this.catchData,
      loadingData: this.loadingData,
      resouceFlowData: this.resouceFlowData,
      webVitalData: this.webVitalData,
    };
    this.reportTracker(this.performanceData)
    console.log(this.performanceData)
  }
}
