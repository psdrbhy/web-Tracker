export default function getAliyun(
  project: string,
  host: string,
  logstore: string,
  result: any,
) {
  let url = `http://${project}.${host}/logstores/${logstore}/track`;
  //因为阿里云要求必须都是字符串类型
  for (const key in result) {
    //处理对象类型
    if (typeof result[key] == 'object') {
      result[key] = JSON.stringify(result[key]);
    } else {
      result[key] = `${result[key]}` as any;
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
    console.log('success');
    console.log(xhr.response);
  };
  xhr.onerror = function (error) {
    console.log('error');
    console.log(error);
  };
  xhr.send(body);
}
