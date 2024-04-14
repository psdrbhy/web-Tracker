import { ReportTracker } from '../types/error';
import { XhrTrackerData } from '../types/AjaxXhr';
import xhrTracker from '../userAction/AjaxXhr';
import { BlankScreenTracker } from '../userAction/BlankScreen';
import { Options } from '../types/error';
export default class ErrorTracker {
  private reportTracker: ReportTracker;
  private options: Options;
  constructor(options:Options, reportTracker: ReportTracker) {
    this.reportTracker = reportTracker;
    this.options = Object.assign(this.initDef(), options);
    this.errorEvent();
  }

  public errorEvent() {
    if (this.options.js) this.jsError();
    if (this.options.http) this.httpError();
    if (this.options.promise) this.promiseError();
    if (this.options.resource) this.resourceError();
    if (this.options.BlankScreen) this.BlankScreen();
  }

  //默认设置
  private initDef() {
    return {
      performance: true,
      cache: true,
      loading: true,
      resourceFlow: true,
    };
  }
  /**
   * error of common js
   *
   */
  private jsError() {
    window.addEventListener(
      'error',
      (event: ErrorEvent) => {
        if (event.colno) {
          this.reportTracker({
            kind: 'error',
            trackerType: 'JsError',
            message: event.message,
            fileName: event.filename,
            position: `line:${event.lineno},col:${event.colno}`,
            stack: this.getLine(event.error.stack, 1),
            url: location.pathname,
          });
        }
      },
      true,
    );
  }

  /**
   *   Error of resource
   */
  private resourceError() {
    window.addEventListener(
      'error',
      (event: Event) => {
        const target = event.target as HTMLScriptElement;
        if (target && target.src) {
          this.reportTracker({
            kind: 'error',
            trackerType: 'resourceError',
            fileName: target.src,
            tagName: target.tagName,
            Html: target.outerHTML,
            url: location.pathname,
          });
        }
      },
      true,
    );
  }
  /**
   * error of promise
   */
  private promiseError() {
    window.addEventListener('unhandledrejection', (event) => {
      let message: string;
      let fileName: string;
      let position: string;
      let stack: string;
      let reason = event.reason;
      //判断resolve或者reject传递的是什么，如果只是字符串就直接返回了
      if (typeof reason === 'string') {
        message = reason;
      } else if (typeof reason === 'object') {
        if (reason.stack) {
          message = reason.message;
          let matchResult = reason.stack.match(
            /(?:at\s+)?(http:\/\/[^\s]+\/[^\s]+):(\d+:\d+)/,
          );
          stack = this.getLine(reason.stack, 3);
          fileName = matchResult[1];
          position = matchResult[2];
        }
      }
      event.promise.catch((error) => {
        this.reportTracker({
          kind: 'error',
          trackerType: 'PromiseError',
          url: location.pathname,
          message,
          fileName,
          stack,
          position,
        });
      });
    });
  }
  /**
   * error of Http
   */
  private httpError() {
    const handler = (xhrTrackerData: XhrTrackerData) => {
      // 大于400才进行上报
      if (xhrTrackerData.status < 400) return;
      this.reportTracker({
        kind: 'error',
        ...xhrTrackerData,
      });
    };
    xhrTracker(handler);
  }
  /**
   * 白屏监控
   *
   */
  public BlankScreen() {
    new BlankScreenTracker(this.reportTracker);
  }
  /**
   * 拼接stack
   * @param stack
   * @returns
   */
  public getLine(stack: string, sliceNum: number) {
    return stack
      .split('\n')
      .slice(sliceNum)
      .map((item) => item.replace(/^\s+at\s+/g, ''))
      .join('^');
  }

}
