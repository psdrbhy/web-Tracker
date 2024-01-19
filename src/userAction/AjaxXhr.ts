import { XMLHttpRequestWithLogData, XhrTrackerData } from '../types/AjaxXhr';
export default function xhrTracker(handlerReport: any) {
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
      let startTime = Date.now();
      let handler = (type: string) => () => {
        let duration = Date.now() - startTime;
        let status = this.status;
        let statusText = this.statusText;
        let data: XhrTrackerData = {
          trackerType: 'xhr',
          eventType: type,
          targetKey: 'message',
          method: (this as XMLHttpRequestWithLogData).logData.method,
          url: (this as XMLHttpRequestWithLogData).logData.url,
          status: status,
          statusText: statusText,
          duration: duration,
          response: this.response ? JSON.stringify(this.response) : '',
          params: body,
        };
        handlerReport(data);
        console.log("fdsffdsa")
      };
      this.addEventListener('error', handler('error'), false);
      this.addEventListener('load', handler('load'), false);

      this.addEventListener('abort', handler('abort'), false);
    }
    return oldSend.call (this, body);
  };
}
