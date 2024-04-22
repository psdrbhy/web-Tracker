import { XMLHttpRequestWithLogData, XhrTrackerData } from '../types/userAction';
export function xhrTracker(handler: (...args: any[]) => any) {
  let XMLHttpRequest = window.XMLHttpRequest;
  // 对XHR上面的方法进行重写
  let oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string) {
    //排除阿里云接口和webpack脏值检测
    if (!url.match(/logstores/) && !url.match(/sockjs/)) {
      
      (this as XMLHttpRequestWithLogData).logData = { method, url };
    }
    return oldOpen.call(this, method, url, true);
  };

  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body: any) {
    if ((this as XMLHttpRequestWithLogData).logData) {
      // let startTime = Date.now();
      // let handler = (type: string) =>  (event:Event) => {
      //   let duration = Date.now() - startTime;
      //   let status = this.status;
      //   let statusText = this.statusText;
      //   let data: XhrTrackerData = {
      //     trackerType: 'xhrError',
      //     eventType: event.type,
      //     method: (this as XMLHttpRequestWithLogData).logData.method,
      //     url: (this as XMLHttpRequestWithLogData).logData.url,
      //     status: status,
      //     statusText: statusText,
      //     duration: duration,
      //     response: this.response ? JSON.stringify(this.response) : '',
      //     params: body || '',
      //   };
      //    handlerReport(data);
      // };
      this.addEventListener('error', handler('error',body,this), false);
      this.addEventListener('load', handler('load',body,this), false);
      this.addEventListener('abort', handler('abort',body,this), false);
    }
    return oldSend.call (this, body);
  };
}
