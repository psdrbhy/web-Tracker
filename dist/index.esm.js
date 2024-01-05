var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

// 重写pushState和replaceState:因为history监听不到
const createHistoryEvent = (type) => {
    //获取到函数
    const orign = history[type];
    return function () {
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

// 需要监听的事件
const MouseEventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
class Tracker {
    constructor(options) {
        this.data = Object.assign(this.initDef(), options); //把options复制到this.initDef中去，有相同的就会覆盖
        this.installTracker();
    }
    //进行一个默认设置
    initDef() {
        // 重写赋值
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');
        return {
            sdkVersion: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
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
                console.log("监听到了");
                //一旦我们监听到我们就系统自动进行上报
                this.reportTracker({
                    event,
                    targetKey,
                    data
                });
            });
        });
    }
    //用来判断是否开启
    installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState', 'replaceState', 'popstate'], "history-pv");
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv');
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }
    /**
     * 上报监控数据给后台
     * @param data 传入的数据
     */
    reportTracker(data) {
        //因为第二个参数BodyInit没有json格式
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([JSON.stringify(params)], headers); //转化成二进制然后进行new一个blob对象
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
    //DOM事件上报：分出来写
    targetKeyReport() {
        MouseEventList.forEach((event) => {
            window.addEventListener(event, (e) => {
                const target = e.target;
                const targetKey = target.getAttribute('target-key');
                // 看dom上有没有这个属性，如果有就进行上报
                if (targetKey) {
                    this.reportTracker({
                        event,
                        targetKey
                    });
                }
            });
        });
    }
    //收集一下
    jsError() {
        this.errorEvent();
        this.promiseError();
    }
    /**
     * 监听普通错误error
     */
    errorEvent() {
        window.addEventListener("error", (event) => {
            this.reportTracker({
                event: "error",
                targetKey: "message",
                message: event.message
            });
        });
    }
    /**
     * 监听promise的错误
     */
    promiseError() {
        window.addEventListener("unhandledrejection", (event) => {
            event.promise.catch(error => {
                this.reportTracker({
                    event: "promiseError",
                    targetKey: "message",
                    message: error
                });
            });
        });
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

export { Tracker as default };
