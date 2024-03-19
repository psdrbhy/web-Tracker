/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key的点击事件上报
 * @sdkVersion 版本
 * @extra 透传字段
 * @jsError js和promise 报错异常上报
 */
export interface DefaultOptions {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    Error: boolean,
    userAction:boolean,
    performance:boolean

}
export interface Options extends Partial<DefaultOptions> {//把上面的一些变成非必填
    requestUrl: string,//只有这个是必须要传
}
export enum TrackerConfig {
    version = "1.0.0",
}



/**
 * @kind 监听大类
 * @errorType 监听大类
 * @kind 监听大类
 * @kind 监听大类
 * @kind 监听大类

 */
interface DefaultErrorParams<T> {
    kind: string,
    trackerType: string | undefined,
    targetKey: string | undefined,
    message: string | undefined,
    fileName: string | undefined,
    position: string | undefined,
    stack: string | undefined,
    data: T
    event: string | undefined,

}
//把上面的一些变成非必填
export interface ErrorParams extends Partial<DefaultErrorParams<any>> {
    kind: string,
}

// 定义阿里云日志需要的参数
export interface aliyunParams{
    project: string,
    host: string,
    logstore:string
}
