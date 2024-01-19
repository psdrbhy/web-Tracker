export default function getUserAgent(userAgent:string) {
    let result;
    if (userAgent.indexOf("chrome") !== -1) {
        result = 'Chrome'
    } else if (userAgent.indexOf("Firefox") !== -1) {
        result = 'Firefox'
    } else if (userAgent.indexOf("Safari") !== -1) {
        result = 'Safari'
    } else if (userAgent.indexOf("Edge") !== -1) {
        result = 'Edge'
    } else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident") !== -1) {
        result = 'Internet Explorer'
    } else {
        result = '无法确定当前浏览器'
    }
    return result;
}