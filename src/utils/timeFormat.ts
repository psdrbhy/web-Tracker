
export function utcFormat(time:number) {
    var date = new Date(time),
        year = date.getFullYear(),
        month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
        day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
        hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
        minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
        seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    return res;
}