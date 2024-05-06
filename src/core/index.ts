import {
  DefaultOptions,
  TrackerConfig,
  Options,
  ErrorParams,
  aliyunParams,
} from '../types/core';
import { utcFormat } from '../utils/timeFormat';
import getAliyun from '../utils/aliyun';
import { userAction } from '../userAction';
import ErrorTracker from '../error/index';
import PerformanceTracker from '../performance/index';
export default class Tracker {
  private appId: string;
  private options: Options;
  private aliyunOptions?: aliyunParams;
  private performance: PerformanceTracker;
  private userAction: userAction;
  private error:ErrorTracker
  constructor(options: Options, aliyunOptions?: aliyunParams) {
    this.options = Object.assign(this.initDef(), options);
    this.aliyunOptions = aliyunOptions;
    this.installTracker();
  }
  //默认设置
  private initDef(): DefaultOptions {
    return <DefaultOptions>{
      sdkVersion: TrackerConfig.version,
      Error: false,
      performance: false,
      userAction:false
    };
  }
  //用来判断是否开启
  private installTracker() {

    if (this.options.Error) this.error = new ErrorTracker({},this.reportTracker.bind(this))
    if (this.options.userAction) this.userAction = new userAction({}, this.reportTracker.bind(this))
    if (this.options.performance) this.performance = new PerformanceTracker({},this.reportTracker.bind(this));
    
  }
  /**
   * 上报监控数据给后台
   * @param data 传入的数据
   */
  public reportTracker<T extends Record<string, any>>(data: T) {
    //因为第二个参数BodyInit没有json格式

    const params = Object.assign(
      { data },
      {
        currentTime: utcFormat(new Date().getTime()),
      },
    );
    // 发送到自己的后台
    let headers = {
      type: 'application/x-www-form-urlencoded',
    };
    let blob = new Blob([JSON.stringify(params)], headers); //转化成二进制然后进行new一个blob对象,会把是"undefined"消除
    navigator.sendBeacon(this.options.requestUrl, blob);
    // 如果存在发送到阿里云中去
    if (this.aliyunOptions) {
      let { project, host, logstore } = this.aliyunOptions;
      getAliyun(project, host, logstore, params);
    }
  }
  /**
   * 手动上报
   */
  public setTracker<T extends ErrorParams>(data: T) {
    this.reportTracker(data);
  }
  /**
   * 用来设置用户id
   * @param uuid 用户id
   */
  public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
    this.options.uuid = uuid;
  }
  /**
   * 用来设置透传字段
   * @param extra 透传字段
   */
  public setExtra<T extends DefaultOptions['extra']>(extra: T) {
    this.options.extra = extra;
  }
  /**
   * 用来设置应用ID
   * @param extra 透传字段
   */
  public setAppId<T extends string>(appId: T) {
    this.appId = appId;
  }
}
