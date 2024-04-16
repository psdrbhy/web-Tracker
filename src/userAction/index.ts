import { ReportTracker } from '../types/error';
import { domTracker } from './Dom';
import { xhrTracker } from './AjaxXhr';
import { RouterChangeTracker } from './RouterChange';
import { OriginInformationTracker } from './originInformation';
import { PageInformationTracker } from './pageInformation';
import { utcFormat } from '../utils/timeFormat';
import { BehaviorStack } from './behaviorStack';

import {
  BehaviorStackData,
  Options,
  RouterData,
  Data,
  XhrTrackerData,
  XMLHttpRequestWithLogData,
} from '../types/userAction';
export class userAction {
  private options: Options;
  private data: Record<Data | string, Record<string, any>>;
  private reportTracker: ReportTracker;
  private behaviorStack: BehaviorStack;
  constructor(options: Options, reportTracker: ReportTracker) {
    this.options = Object.assign(this.initDef(), options);
    this.data = {};
    this.reportTracker = reportTracker;
    this.behaviorStack = new BehaviorStack(this.options.maxStackLength);
    this.eventTracker();
  }
  //默认设置
  private initDef() {
    return {

      Dom: true,
      Xhr: true,
      pageInfo: true,
      behaviorStack: true,
      RouterChange: true,
      elementTrackList: ['button'],
      attributeTrackList: 'target-key',
      MouseEventList: ['click'],
      maxStackLength: 100,
    };
  }
  public eventTracker() {
    if (this.options.RouterChange) {
      this.RouterChange();
    }
    if (this.options.pageInfo) {
      this.pageData();
    }
    if (this.options.Dom) {
      this.Dom();
    }
    if (this.options.Xhr) {
      this.AjaxXhr();
    }
  }

  /**
   * dom
   *
   */
  public Dom() {
    domTracker((e, event) => {
      const target = e.target as HTMLElement;
      const targetKey = target.getAttribute(this.options.attributeTrackList);
      let isElementTrack = this.options.elementTrackList.includes(
        (event.target as HTMLElement)?.tagName?.toLocaleLowerCase(),
      )
        ? (event.target as HTMLElement)
        : undefined;
      if (isElementTrack) {
        const domData = {
          tagInfo: {
            id: target.id,
            classList: Array.from(target.classList),
            tagName: target.tagName,
            text: target.textContent,
          },
          pageInfo: PageInformationTracker(),
          time: new Date().getTime(),
          timeFormat: utcFormat(new Date().getTime()),
        };

        if (this.data[Data.Dom]) this.data[Data.Dom].push(domData);
        else this.data[Data.Dom] = [domData];

        // 添加到行为栈中
        const hehaviorStackData: BehaviorStackData = {
          name: event,
          pathname: PageInformationTracker().pathname,
          value: {
            tagInfo: {
              id: target.id,
              classList: Array.from(target.classList),
              tagName: target.tagName,
              text: target.textContent,
            },
            pageInfo: PageInformationTracker(),
          },
          time: new Date().getTime(),
          timeFormat: utcFormat(new Date().getTime()),
        };
        this.behaviorStack.set(hehaviorStackData);
      } else if (targetKey) {
        this.reportTracker({
          kind: 'stability',
          trackerType: 'domTracker',
          event,
          targetKey,
        });
      }
    }, this.options.MouseEventList);
  }
  /**
   * router监控
   *
   */
  public RouterChange() {
    RouterChangeTracker((e) => {
      const routerData: RouterData = {
        routerType: e.type,
        pageInfo: PageInformationTracker(),
        time: new Date().getTime(),
        timeFormat: utcFormat(new Date().getTime()),
      };
      if (this.data[Data.RouterChange])
        this.data[Data.RouterChange].push(routerData);
      else this.data[Data.RouterChange] = [routerData];

      const hehaviorStackData: BehaviorStackData = {
        name: 'RouterChange',
        pathname: PageInformationTracker().pathname,
        value: {
          Type: e.type,
        },
        time: new Date().getTime(),
        timeFormat: utcFormat(new Date().getTime()),
      };
      this.behaviorStack.set(hehaviorStackData);
      // 当路由发生变化就重新上报页面数据
      this.pageData();
    });
  }
  /**
   * 页面信息
   *
   */
  public pageData() {
    const pageData = {
      pageInformation: PageInformationTracker(),
      originInformation: OriginInformationTracker(),
    };
    this.data[Data.PageInfo] = pageData;
    this.reportTracker(pageData);
  }

  /**
   * ajax请求
   *
   */
  public AjaxXhr() {
    xhrTracker(function (event, body) {
      let startTime = Date.now();
      let duration = Date.now() - startTime;
      let status = this.status;
      let statusText = this.statusText;
      let data: XhrTrackerData = {
        trackerType: 'xhrError',
        eventType: event.type,
        method: (this as XMLHttpRequestWithLogData).logData.method,
        url: (this as XMLHttpRequestWithLogData).logData.url,
        status: status,
        statusText: statusText,
        duration: duration,
        response: this.response ? JSON.stringify(this.response) : '',
        params: body || '',
      };
      if (this.data[Data.Xhr]) this.data[Data.Xhr].push(data);
      else this.data[Data.Xhr] = [data];

      const hehaviorStackData: BehaviorStackData = {
        name: 'RouterChange',
        pathname: PageInformationTracker().pathname,
        value: {
          Type: event.type,
          method: (this as XMLHttpRequestWithLogData).logData.method,
          url: (this as XMLHttpRequestWithLogData).logData.url,
          response: this.response ? JSON.stringify(this.response) : '',
          params: body || '',
        },
        time: new Date().getTime(),
        timeFormat: utcFormat(new Date().getTime()),
      };
      this.behaviorStack.set(hehaviorStackData);
    });
  }

  /**
   * 整体data进行上报
   *
   */
  public reportActions() {
    this.reportTracker(this.data);
    if(this.options.behaviorStack){
      this.reportTracker(this.behaviorStack.get());
    }
  }
}
