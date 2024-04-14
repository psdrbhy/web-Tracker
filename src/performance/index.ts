import { resourceFlow } from './resourceFlow';
import { loadingData } from './loading';
import { WebVitals } from './performance';
import { cache } from './cache';
import { type ReportTracker,Options,Data } from '../types/performance';
import {
  type ResourceFlow,
  type LoadingData,
  type CatchData,
} from '../types/performance';
export default class PerformanceTracker {
  private options:Options
  private data: Record<Data | string, Record<string, any>>;
  private resourceFlowData: ResourceFlow[];
  private loadingData: LoadingData;
  private catchData: CatchData;
  private webVitalData: Record<string, Record<string, any>>;
  private reportTracker: ReportTracker;
  constructor(options:Options,reportTracker: ReportTracker) {
    this.options = Object.assign(this.initDef(), options);
    this.data = {}
    this.reportTracker = reportTracker;
    this.performanceEvent();

  }
  public performanceEvent() {
    if(this.options.loading) this.getloading();
    if(this.options.cache) this.getCache();
    if(this.options.resourceFlow) this.getResouceFlow();
    if(this.options.performance) this.getWebVitals();

    
    this.reportPerformance();
  }
    //默认设置
    private initDef() {
      return {
        performance:true,
        cache:true,
        loading:true,
        resourceFlow:true
      };
    }
  /**
   * 获取dom流
   *
   */
  public getResouceFlow() {
    this.data[Data.resourceFlow] = resourceFlow();
  }
  /**
   * 获取各类loading时间
   *
   */
  public getloading() {
    this.data[Data.loading] = loadingData();
  }
  /**
   * 获取WebVitals指标
   *
   */
  public getWebVitals() {
    WebVitals((data)=>{
      this.data[Data.performance] = data
      console.log("全部回调完成")
      this.reportPerformance()
    });

  }
  /**
   * 获取缓存
   *
   */
  public getCache() {
    this.data[Data.cache] = cache();
  }

  public reportPerformance() {
    this.reportTracker(this.data)
  }
}
