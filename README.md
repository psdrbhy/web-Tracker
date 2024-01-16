#### 前端监控性能工具SDK

#### 自定义开启需要的监控指标
可接入自己后台或者使用阿里云的日志服务SLS进行监控

 * @requestUrl      接口地址 必传
 * @historyTracker  history上报
 * @hashTracker     hash上报
 * @domTracker      携带Tracker-key的点击事件上报
 * @sdkVersion      版本
 * @extra           透传字段
 * @Error           报错异常上报
    可选
 * @project         Project名称
 * @host            所在地域的服务入口。例如cn-hangzhou.log.aliyuncs.com
 * @logstore        Logstore名称


#### 使用方式
下载依赖：
```
npm i aquan-tracker
```

在项目中进行配置
``` 
eg:
  new Tracker({
      requestUrl:"http://localhost:3000/curd",
      historyTracker:false,
      domTracker:true,
      Error:true
  },{
      project:'aquan-tracker',
      host:'cn-guangzhou.log.aliyuncs.com',
      logstore:'aquan-logstore'
  })
``` 