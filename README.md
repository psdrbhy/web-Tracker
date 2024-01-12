#### 一个前端监控性能工具

使用方式：
```
npm i aquan-tracker
```

#### 自定义开启需要的监控指标
可接入自己后台或者使用阿里云的日志服务SLS进行监控

 * @requestUrl      接口地址 必传
 * @historyTracker  history上报
 * @hashTracker     hash上报
 * @domTracker      携带Tracker-key的点击事件上报
 * @sdkVersion      版本
 * @extra           透传字段
 * @jsError         js和promise 报错异常上报
    可选
 * @project         Project名称
 * @host            所在地域的服务入口。例如cn-hangzhou.log.aliyuncs.com
 * @logstore        Logstore名称

``` 
eg:
  new Tracker({
      requestUrl:"http://localhost:3000/curd",
      historyTracker:false,
      domTracker:true,
      jsError:true
  },{
      project:'aquan-tracker',
      host:'cn-guangzhou.log.aliyuncs.com',
      logstore:'aquan-logstore'
  })
``` 