import { DefaultOptions, TrackerConfig, Options } from "../types/index";
import { createHistoryEvent } from "../utils/pv";

// 需要监听的事件

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']

export default class Tracker{
    public data: Options; //为什么这里没有传requestUrl没有报错
    constructor(options:Options) {
        this.data = Object.assign(this.initDef(), options);//把options复制到this.initDef中去，有相同的就会覆盖
        this.installTracker()
    }
    //进行一个默认设置
    private initDef(): DefaultOptions {
        // 重写赋值
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <DefaultOptions>{
            sdkVersion:TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,  
            jsError:false
        }
    }
    /**
     * 事件捕获器
     * @param mouseEventList 事件列表
     * @param targetKey 这个值是后台定的
     * @param data 
     */
    private captureEvents <T>(mouseEventList:string[],targetKey:string,data?:T) {
        mouseEventList.forEach((event, index) => {
            window.addEventListener(event, () => {
                console.log("监听到了")
                //一旦我们监听到我们就系统自动进行上报
                this.reportTracker({
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
            this.captureEvents(['pushState','replaceState','popstate'],"history-pv")
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'],'hash-pv')
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
    private reportTracker<T>(data: T) {
        //因为第二个参数BodyInit没有json格式
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        let headers = {
            type:'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers); //转化成二进制然后进行new一个blob对象

        navigator.sendBeacon(this.data.requestUrl, blob);

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
                        event,
                        targetKey
                    })
                }
            })
        })
    }
    //收集一下
    private jsError() {
        this.errorEvent()
        this.promiseError()
    }

    /**
     * 监听普通错误error
     */
    private errorEvent() {
        window.addEventListener("error", (event) => {
            this.reportTracker({
                event:"error",
                targetKey: "message",
                message:event.message
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
                    event:"promiseError",
                    targetKey: "message",
                    message:error
                })
            })

        })
    }

    /**
     * 手动上报
     */
    public setTracker <T>(data:T) {
        this.reportTracker(data)
    }
    /**
     * 用来设置用户id
     * @param uuid 用户id
     */
    public setUserId<T extends DefaultOptions['uuid']>(uuid:T) {
        this.data.uuid = uuid
    }
    /**
     * 用来设置透传字段
     * @param extra 透传字段
     */
    public setExtra<T extends DefaultOptions['extra']>(extra:T) {
        this.data.extra = extra
    }

}