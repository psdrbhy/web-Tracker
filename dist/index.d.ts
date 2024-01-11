/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key的点击事件上报
 * @sdkVersion 版本
 * @extra 透传字段
 * @jsError js和promise 报错异常上报
 */
interface DefaultOptions {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyTracker: boolean;
    hashTracker: boolean;
    domTracker: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends Partial<DefaultOptions> {
    requestUrl: string;
}

declare class Tracker {
    data: Options;
    constructor(options: Options);
    private initDef;
    /**
     * 事件捕获器
     * @param mouseEventList 事件列表
     * @param targetKey 这个值是后台定的
     * @param data
     */
    private captureEvents;
    private installTracker;
    /**
     * 上报监控数据给后台
     * @param data 传入的数据
     */
    private reportTracker;
    private targetKeyReport;
    private jsError;
    /**
     * 监听普通js错误
     *
     *
     */
    private errorEvent;
    /**
     * 监听promise的错误
     */
    private promiseError;
    /**
     * 手动上报
     */
    setTracker<T>(data: T): void;
    /**
     * 用来设置用户id
     * @param uuid 用户id
     */
    setUserId<T extends DefaultOptions['uuid']>(uuid: T): void;
    /**
     * 用来设置透传字段
     * @param extra 透传字段
     */
    setExtra<T extends DefaultOptions['extra']>(extra: T): void;
    /**
     * 拼接stack
     * @param stack
     * @returns
     */
    getLine(stack: string): string;
}

export { Tracker as default };
