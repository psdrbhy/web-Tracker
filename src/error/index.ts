import { ReportTracker } from '../types/error';
import { XhrTrackerData } from '../types/xhr';
import xhrTracker from '../userAction/xhr';
export default class ErrorTracker {
  private reportTracker: ReportTracker;
  constructor(reportTracker: ReportTracker) {
    this.reportTracker = reportTracker;
  }

  public jsError() {
    this.errorEvent();
    this.resourceError();
    this.promiseError();
    this.httpError();
  }
  /**
   * error of common js
   *
   */
  private errorEvent() {
    window.addEventListener(
      'error',
      (event: ErrorEvent) => {
        if (event.colno) {
          this.reportTracker({
            kind: 'error',
            trackerType: 'JsError',
            targetKey: 'message',
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
        console.log(event);
        const target = event.target as HTMLScriptElement;
        if (target && target.src) {
          this.reportTracker({
            kind: 'error',
            trackerType: 'resourceError',
            targetKey: 'message',
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
          targetKey: 'message',
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
        kind: 'xhrError',
        ...xhrTrackerData
      })
    };
    xhrTracker(handler);
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

  public getExtraData() {
    return {
      title: document.title,
      // url: Location.url,
      timestamp: Date.now(),
      // userAgent:userAgent.parse(navigator,userAgent).name
    };
  }
}
