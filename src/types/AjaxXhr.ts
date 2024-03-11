
/**
 * @trackerType 监控类型
 * @eventType 具体类型
 * @targetKey  dfs
 * @ method    请求方法
 * @url       请求地址
 * @status    请求状态码
 * @statusText 状态信息
 * @duration  请求的实际时间
 * @response   响应体
 */
interface DefaultXhrTrackerData{
    trackerType: string | undefined,
    eventType:string | undefined,
    method: string | undefined,
    url:string | URL | undefined,
    status: number,
    statusText:string
    duration: Date | number,  
    response: any,
    params:any


}


export interface XhrTrackerData extends Partial<DefaultXhrTrackerData> {
    trackerType: string | undefined,
    status: number,
}


interface XMLHttpRequestAdd {
    method: string | undefined,
    url:string | URL | undefined,
}
export interface XMLHttpRequestWithLogData extends XMLHttpRequest {
    logData: XMLHttpRequestAdd;
}