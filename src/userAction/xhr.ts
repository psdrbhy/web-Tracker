import { XMLHttpRequestWithLogData, XhrTrackerData } from '../types/xhr';
export default function xhrTracker(handlerReport: any) {
  let XMLHttpRequest = window.XMLHttpRequest;
  // 对XHR上面的方法进行重写
  let oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string) {
    if (!url.match(/logstores/)) { //排除阿里云
      (this as XMLHttpRequestWithLogData).logData = { method, url };
    }

    return oldOpen.call(this, method, url, true);
  };

  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    if ((this as XMLHttpRequestWithLogData).logData) {
      let startTime = Date.now();
      let handler = (type: string) => () => {
        let duration = Date.now() - startTime;
        let status = this.status; //这里为什么又可以使用this
        let data: XhrTrackerData = {
          trackerType: 'ajax',
          eventType: type,
          targetKey: 'message',
          method: (this as XMLHttpRequestWithLogData).logData.method,
          url: (this as XMLHttpRequestWithLogData).logData.url,
          status: status,
          duration: duration,
          response: this.response ? JSON.stringify(this.response) : '',
        };
        console.log('sssssssssssss');
        handlerReport(data);
      };
      this.addEventListener('load', handler('load'), false);
      this.addEventListener('error', handler('error'), false);
      this.addEventListener('abort', handler('abort'), false);
    }
    return oldSend.call(this);
  };
}
