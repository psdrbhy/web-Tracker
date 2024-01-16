

interface DefaultXhrTrackerData{
    trackerType: string | undefined,
    eventType:string | undefined,
    targetKey: string | undefined,
    method: string | undefined,
    url:string | URL | undefined,
    status: number,
    duration: Date | number,
    response:any
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