import { DefaultOptions, TrackerConfig, Options, ErrorParams, aliyunParams } from "../types/index";
import { createHistoryEvent } from "../utils/pv";
import { utcFormat } from '../utils/timeFormat'
import getAliyun from '../utils/aliyun'
// 需要监听的事件

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
export default class Tracker {
    public data: Options;
    public aliyunOptions?: aliyunParams
    // public lastEvent: Event;
    constructor(options: Options, aliyunOptions?: aliyunParams) {
        this.data = Object.assign(this.initDef(), options);//把options复制到this.initDef中去，有相同的就会覆盖
        // this.lastEvent = lastEvent()
        this.aliyunOptions = aliyunOptions
        this.installTracker()
    }
    //进行一个默认设置
    private initDef(): DefaultOptions {
        // 重写赋值
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <DefaultOptions>{
            sdkVersion: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        }
    }
    /**
     * 事件捕获器
     * @param mouseEventList 事件列表
     * @param targetKey 这个值是后台定的
     * @param data 
     */
    private captureEvents<T>(mouseEventList: string[], targetKey: string, data?: T) {
        mouseEventList.forEach((event, index) => {
            window.addEventListener(event, () => {
                console.log("监听到了")
                //一旦我们监听到我们就系统自动进行上报
                this.reportTracker({
                    kind: 'stability',
                    trackerType: "historyTracker",
                    event,
                    targetKey,
                    data
                })

            })
        })
    }
    //用来判断是否开启
    private installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState', 'replaceState', 'popstate'], "history-pv")
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv')
        }
        if (this.data.domTracker) {
            this.targetKeyReport()
        }
        if (this.data.jsError) {

            this.jsError()
        }
    }
    /**
     * 上报监控数据给后台
     * @param data 传入的数据
     */
    private reportTracker<T extends ErrorParams>(data: T) {
        //因为第二个参数BodyInit没有json格式
        this.data.trackerParams = data
        const params = Object.assign(this.data, { currentTime: utcFormat(new Date().getTime()) });
        // 发送到自己的后台
        let headers = {
            type: 'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers); //转化成二进制然后进行new一个blob对象
        navigator.sendBeacon(this.data.requestUrl, blob);
        // 如果存在发送到阿里云中去
        if (this.aliyunOptions) {
            let { project, host, logstore } = this.aliyunOptions
            console.log(params)
            getAliyun(project, host, logstore, params)
        }


    }

    //DOM事件上报：分出来写
    private targetKeyReport() {
        MouseEventList.forEach((event) => {
            window.addEventListener(event, (e) => {
                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key');
                // 看dom上有没有这个属性，如果有就进行上报
                if (targetKey) {
                    this.reportTracker({
                        kind: 'stability',
                        trackerType: "domTracker",
                        event,
                        targetKey,
                        // selector:e? getSelector(e) : '' //代表最后一个操作的元素
                    })
                }
            },
                {
                    capture: true,//捕获：为了让获得的是最底层的那个，也是为了实现那个路径的功能
                    passive: true //性能优化
                }
            )
        })
    }
    //收集一下
    private jsError() {

        this.errorEvent()
        this.promiseError()
    }

    /**
     * 监听普通js错误
     * 
     */
    private errorEvent() {
        window.addEventListener("error", (event) => {
            // let lastEvent = this.lastEvent;
            // console.log(lastEvent)
            this.reportTracker({
                kind: 'stability',
                trackerType: "JsError",
                targetKey: "message",
                message: event.message,
                fileName: event.filename,
                position: `line:${event.lineno},col:${event.colno}`,
                stack: this.getLine(event.error.stack),
                // selector:
            })
        })
    }
    /**
     * 监听promise的错误
     */
    private promiseError() {
        window.addEventListener("unhandledrejection", (event) => {
            event.promise.catch(error => {
                this.reportTracker({
                    kind: 'stability',
                    trackerType: "PromiseError",
                    targetKey: "message",
                    message: error
                })
            })

        })
    }

    /**
     * 手动上报
     */
    public setTracker<T extends ErrorParams>(data: T) {
        this.reportTracker(data)
    }
    /**
     * 用来设置用户id
     * @param uuid 用户id
     */
    public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid
    }
    /**
     * 用来设置透传字段
     * @param extra 透传字段
     */
    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra
    }
    /**
     * 拼接stack
     * @param stack 
     * @returns 
     */
    public getLine(stack: string) {
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^')
    }


    public getExtraData() {

        return {
            title: document.title,
            // url: Location.url,
            timestamp: Date.now(),
            // userAgent:userAgent.parse(navigator,userAgent).name
        }
    }
}