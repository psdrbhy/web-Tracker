(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('web-vitals')) :
    typeof define === 'function' && define.amd ? define(['web-vitals'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Tracker = factory(global.webVitals));
})(this, (function (webVitals) { 'use strict';

    var TrackerConfig;
    (function (TrackerConfig) {
        TrackerConfig["version"] = "1.0.0";
    })(TrackerConfig || (TrackerConfig = {}));

    // 重写pushState和replaceState:因为history监听不到
    const createHistoryEvent = (type) => {
        //获取到函数
        const orign = history[type];
        return function () {
            //这里的this是一个假参数
            const res = orign.apply(this, arguments);
            // 创建事件
            const e = new Event(type);
            // 派发事件
            window.dispatchEvent(e);
            return res;
        };
    };
    // window.addEventListener
    // createHistoryEvent("pushState")

    function utcFormat(time) {
        var date = new Date(time), year = date.getFullYear(), month = date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1), day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(), hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(), minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(), seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
        var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
        return res;
    }

    function getAliyun(project, host, logstore, result) {
        let url = `http://${project}.${host}/logstores/${logstore}/track`;
        //因为阿里云要求必须都是字符串类型
        for (const key in result) {
            //处理对象类型
            if (typeof result[key] == 'object') {
                result[key] = JSON.stringify(result[key]);
            }
            else {
                result[key] = `${result[key]}`;
            }
        }
        let body = JSON.stringify({
            __logs__: [result],
        });
        let xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        xhr.setRequestHeader('x-log-bodyrawsize', `${result.length}`);
        xhr.onload = function (res) {
            console.log('阿里云上报成功');
        };
        xhr.onerror = function (error) {
            console.log('阿里云上报失败');
        };
        xhr.send(body);
    }

    class BlankScreenTracker {
        constructor(reportTracker) {
            this.reportTracker = reportTracker;
            this.emptyPoint = 0;
            this.load();
            // this.element()
        }
        load() {
            // 页面状态为complete才进行
            if (document.readyState === 'complete') {
                this.element();
            }
            else {
                window.addEventListener('load', () => {
                    this.element();
                    if (this.emptyPoint > 8) {
                        let centerElement = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
                        this.reportTracker({
                            kind: 'userAction',
                            trackerType: 'blank',
                            emptyPoint: this.emptyPoint,
                            screen: window.screen.width + 'X' + window.screen.height,
                            viewPoint: window.innerWidth + 'X' + window.innerHeight,
                            selector: this.getSelector(centerElement), //放中间元素
                        });
                    }
                });
            }
        }
        element() {
            for (let i = 0; i < 9; i++) {
                let XElement = document.elementFromPoint((window.innerWidth * i) / 10, window.innerHeight / 2);
                let YElement = document.elementFromPoint(window.innerWidth / 2, (window.innerHeight * i) / 10);
                this.isWrapper(XElement);
                this.isWrapper(YElement);
            }
        }
        /**
       * 判断是否白点
       */
        isWrapper(element) {
            let WrapperElement = ['html', 'body', '#container', '.content'];
            let selector = this.getSelector(element);
            if (WrapperElement.indexOf(selector) != -1) {
                this.emptyPoint++;
            }
        }
        getSelector(element) {
            if (element === null || element === void 0 ? void 0 : element.id) {
                return '#' + element.id;
            }
            else if (element === null || element === void 0 ? void 0 : element.className) {
                // 处理一个dom上面class可能多个的问题
                let className = element.className
                    .split(' ')
                    .filter((item) => !!item)
                    .join('.');
                return '.' + className;
            }
            else {
                return element === null || element === void 0 ? void 0 : element.nodeName.toLowerCase();
            }
        }
    }

    function targetKeyReport(reportTracker) {
        // 需要监听的事件
        const MouseEventList = [
            'click',
            'dblclick',
            'contextmenu',
            'mousedown',
            'mouseup',
            'mouseenter',
            'mouseout',
            'mouseover',
        ];
        MouseEventList.forEach((event) => {
            window.addEventListener(event, (e) => {
                const target = e.target;
                const targetKey = target.getAttribute('target-key');
                // 看dom上有没有这个属性，如果有就进行上报
                if (targetKey) {
                    reportTracker({
                        kind: 'stability',
                        trackerType: 'domTracker',
                        event,
                        targetKey,
                        // selector:e? getSelector(e) : '' //代表最后一个操作的元素
                    });
                }
            }, {
                capture: true, //捕获：为了让获得的是最底层的那个，也是为了实现那个路径的功能
                passive: true, //性能优化
            });
        });
    }

    class userAction {
        constructor(reportTracker) {
            this.reportTracker = reportTracker;
        }
        eventTracker() {
            this.blankScreen();
        }
        blankScreen() {
            new BlankScreenTracker(this.reportTracker);
        }
        Dom() {
            targetKeyReport(this.reportTracker);
        }
    }

    function xhrTracker(handlerReport) {
        let XMLHttpRequest = window.XMLHttpRequest;
        // 对XHR上面的方法进行重写
        let oldOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            //排除阿里云接口和webpack脏值检测
            if (!url.match(/logstores/) && !url.match(/sockjs/)) {
                this.logData = { method, url };
            }
            return oldOpen.call(this, method, url, true);
        };
        let oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            if (this.logData) {
                let startTime = Date.now();
                let handler = (type) => (event) => {
                    let duration = Date.now() - startTime;
                    let status = this.status;
                    let statusText = this.statusText;
                    let data = {
                        trackerType: 'xhrError',
                        eventType: event.type,
                        method: this.logData.method,
                        url: this.logData.url,
                        status: status,
                        statusText: statusText,
                        duration: duration,
                        response: this.response ? JSON.stringify(this.response) : '',
                        params: body || '',
                    };
                    handlerReport(data);
                };
                this.addEventListener('error', handler(), false);
                this.addEventListener('load', handler(), false);
                this.addEventListener('abort', handler(), false);
            }
            return oldSend.call(this, body);
        };
    }

    class ErrorTracker {
        constructor(reportTracker) {
            this.reportTracker = reportTracker;
        }
        errorEvent() {
            this.jsError();
            this.resourceError();
            this.promiseError();
            this.httpError();
        }
        /**
         * error of common js
         *
         */
        jsError() {
            window.addEventListener('error', (event) => {
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
            }, true);
        }
        /**
         *   Error of resource
         */
        resourceError() {
            window.addEventListener('error', (event) => {
                const target = event.target;
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
            }, true);
        }
        /**
         * error of promise
         */
        promiseError() {
            window.addEventListener('unhandledrejection', (event) => {
                let message;
                let fileName;
                let position;
                let stack;
                let reason = event.reason;
                //判断resolve或者reject传递的是什么，如果只是字符串就直接返回了
                if (typeof reason === 'string') {
                    message = reason;
                }
                else if (typeof reason === 'object') {
                    if (reason.stack) {
                        message = reason.message;
                        let matchResult = reason.stack.match(/(?:at\s+)?(http:\/\/[^\s]+\/[^\s]+):(\d+:\d+)/);
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
        httpError() {
            const handler = (xhrTrackerData) => {
                // 大于400才进行上报
                if (xhrTrackerData.status < 400)
                    return;
                this.reportTracker(Object.assign({ kind: 'error' }, xhrTrackerData));
            };
            xhrTracker(handler);
        }
        /**
         * 拼接stack
         * @param stack
         * @returns
         */
        getLine(stack, sliceNum) {
            return stack
                .split('\n')
                .slice(sliceNum)
                .map((item) => item.replace(/^\s+at\s+/g, ''))
                .join('^');
        }
        getExtraData() {
            return {
                title: document.title,
                // url: Location.url,
                timestamp: Date.now(),
                // userAgent:userAgent.parse(navigator,userAgent).name
            };
        }
    }

    function ResourceFlow() {
        const resouceDatas = performance.getEntriesByType('resource');
        return resouceDatas.map((resourceData) => {
            console.log(resouceDatas, "sfsfs");
            const { name, transferSize, initiatorType, startTime, responseEnd, domainLookupEnd, domainLookupStart, connectStart, connectEnd, secureConnectionStart, responseStart, requestStart, } = resourceData;
            return {
                name,
                initiatorType,
                transferSize,
                start: startTime,
                end: responseEnd,
                DNS: domainLookupEnd - domainLookupStart,
                TCP: connectEnd - connectStart,
                SSL: connectEnd - secureConnectionStart,
                TTFB: responseStart - requestStart,
                Trans: responseEnd - requestStart,
            };
        });
    }
    console.log("pp");

    function loadingData() {
        const loadingData = performance.getEntriesByType('navigation')[0];
        console.log(loadingData);
        const { domainLookupStart, domainLookupEnd, connectStart, connectEnd, secureConnectionStart, requestStart, responseStart, responseEnd, domInteractive, domContentLoadedEventEnd, loadEventStart, fetchStart, } = loadingData;
        return {
            DNS: {
                start: domainLookupStart,
                end: domainLookupEnd,
                value: domainLookupEnd - domainLookupStart,
            },
            TCP: {
                start: connectStart,
                end: connectEnd,
                value: connectEnd - connectStart,
            },
            SSL: {
                start: secureConnectionStart !== null && secureConnectionStart !== void 0 ? secureConnectionStart : 0,
                end: secureConnectionStart ? connectEnd : 0,
                value: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
            },
            TTFB: {
                start: requestStart,
                end: responseStart,
                value: responseStart - requestStart,
            },
            Trans: {
                start: responseStart,
                end: responseEnd,
                value: responseEnd - responseStart,
            },
            FP: {
                start: fetchStart,
                end: responseEnd,
                value: responseEnd - fetchStart,
            },
            DomParse: {
                start: responseEnd,
                end: domInteractive,
                value: domInteractive - responseEnd,
            },
            TTI: {
                start: fetchStart,
                end: domInteractive,
                value: domInteractive - fetchStart,
            },
            DomReady: {
                start: fetchStart,
                end: domContentLoadedEventEnd,
                value: domContentLoadedEventEnd - fetchStart,
            },
            Res: {
                start: responseEnd,
                end: loadEventStart,
                value: loadEventStart - responseEnd,
            },
            Load: {
                start: fetchStart,
                end: loadEventStart,
                value: loadEventStart - fetchStart,
            },
        };
    }

    function WebVitals() {
        console.log("sssssssssssssssssssss");
        console.log(webVitals.onCLS);
        let data;
        webVitals.onCLS((metricData) => {
            data.CLS = {
                name: metricData.name,
                value: metricData.value,
                rating: metricData.rating,
            };
            console.log(metricData);
        });
        webVitals.onFCP((metricData) => {
            data.FCP = {
                name: metricData.name,
                value: metricData.value,
                rating: metricData.rating,
            };
            console.log(metricData);
        });
        webVitals.onLCP((metricData) => {
            data.LCP = {
                name: metricData.name,
                value: metricData.value,
                rating: metricData.rating,
            };
            console.log(metricData);
        });
        webVitals.onFID((metricData) => {
            data.FID = {
                name: metricData.name,
                value: metricData.value,
                rating: metricData.rating,
            };
            console.log(metricData);
        });
        return data;
    }

    class PerformanceTracker {
        constructor(reportTracker) {
            this.reportTracker = reportTracker;
        }
        performanceEvent() {
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
        getResouceFlow() {
            ResourceFlow();
            // console.log(reuslt,"result,ressult")
        }
        /**
       * 获取各类loading时间
       *
       */
        getloading() {
            loadingData();
            // console.log(result,"resultresultresultresultresultresultresult")
        }
        getWebVitals() {
            const result = WebVitals();
            console.log(result);
        }
    }

    class Tracker {
        // public lastEvent: Event;
        constructor(options, aliyunOptions) {
            this.data = Object.assign(this.initDef(), options); //把options复制到this.initDef中去，有相同的就会覆盖
            // this.lastEvent = lastEvent()
            this.aliyunOptions = aliyunOptions;
            // this.userAgent = parser.getResult()
            this.installTracker();
        }
        //默认设置
        initDef() {
            // 重写赋值
            window.history['pushState'] = createHistoryEvent('pushState');
            window.history['replaceState'] = createHistoryEvent('replaceState');
            return {
                sdkVersion: TrackerConfig.version,
                historyTracker: false,
                hashTracker: false,
                domTracker: false,
                Error: false,
                performance: false,
            };
        }
        /**
         * 事件捕获器
         * @param mouseEventList 事件列表
         * @param targetKey 这个值是后台定的
         * @param data
         */
        captureEvents(mouseEventList, targetKey, data) {
            mouseEventList.forEach((event, index) => {
                window.addEventListener(event, () => {
                    //一旦我们监听到我们就系统自动进行上报
                    this.reportTracker({
                        kind: 'stability',
                        trackerType: 'historyTracker',
                        event,
                        targetKey,
                        data,
                    });
                });
            });
        }
        //用来判断是否开启
        installTracker() {
            if (this.data.historyTracker) {
                this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
            }
            if (this.data.hashTracker) {
                this.captureEvents(['hashchange'], 'hash-pv');
            }
            if (this.data.Error) {
                const errorTrackerObject = new ErrorTracker(this.reportTracker.bind(this));
                errorTrackerObject.errorEvent();
            }
            if (this.data.userAction) {
                const userActionTrackerClass = new userAction(this.reportTracker.bind(this));
                userActionTrackerClass.eventTracker();
                if (this.data.domTracker) {
                    userActionTrackerClass.Dom();
                }
            }
            if (this.data.performance) {
                console.log("开启了performance");
                const performanceTrackerObject = new PerformanceTracker(this.reportTracker.bind(this));
                performanceTrackerObject.performanceEvent();
            }
        }
        /**
         * 上报监控数据给后台
         * @param data 传入的数据
         */
        reportTracker(data) {
            //因为第二个参数BodyInit没有json格式
            console.log(data);
            const params = Object.assign({ data }, {
                currentTime: utcFormat(new Date().getTime()),
                userAgent: 'fds',
            });
            console.log(params, "params");
            // 发送到自己的后台
            let headers = {
                type: 'application/x-www-form-urlencoded',
            };
            let blob = new Blob([JSON.stringify(params)], headers); //转化成二进制然后进行new一个blob对象,会把是"undefined"消除
            navigator.sendBeacon(this.data.requestUrl, blob);
            // 如果存在发送到阿里云中去
            if (this.aliyunOptions) {
                let { project, host, logstore } = this.aliyunOptions;
                getAliyun(project, host, logstore, params);
            }
        }
        /**
         * 手动上报
         */
        setTracker(data) {
            this.reportTracker(data);
        }
        /**
         * 用来设置用户id
         * @param uuid 用户id
         */
        setUserId(uuid) {
            this.data.uuid = uuid;
        }
        /**
         * 用来设置透传字段
         * @param extra 透传字段
         */
        setExtra(extra) {
            this.data.extra = extra;
        }
    }

    return Tracker;

}));
