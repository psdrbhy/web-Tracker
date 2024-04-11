/**
 * @param href url
 * @param origin 页面来源（返回一个包含协议，域名，端口号的字符串）
 * @param protocol 协议号 例如 https
 * @param host 域名 + 端口号 例如： www.example.com:8080
 * @param hostname 域名 例如：www.example.com
 * @param port 端口号 例如 8080
 * @param pathname 路由路径  例如：/page
 * @param search 查询字符串 例如 ?param1=value1&param2=value2
 * @param hash URL 中的片段标识符部分，即 # 及其后的部分。
 * @param title 网页标题
 * @param language 浏览器的语种 (eg:zh) ; 这里截取前两位，有需要也可以不截取
 * @param userAgentData 用户 userAgent 信息
 * @param winScreen 屏幕宽高 (eg:1920x1080)  屏幕宽高意为整个显示屏的宽高
 * @param docScreen 文档宽高 (eg:1388x937)   文档宽高意为当前页面显示的实际宽高
 *
 */

export interface PageInformation {
  href: string;
  origin: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  title: string;
  language: string;
  userAgent: Record<string, any>;
  winScreen: string;
  docScreen: string;
}

export interface OriginInformation {
  referrer: string;
  type: string;
}
export interface RouterData {
  routerType: any;
  pageInfo: object;
  time: number;
  timeFormat: string;
}

export interface HehaviorStackData {
  name: string;
  page: string;
  value: {
    Type: any;
  };
  time: number;
  timeFormat: string;
}

export interface Options {
  PI: Boolean;
  OI: Boolean;
  RCR: Boolean;
  DBR: Boolean;
  HT: Boolean;
  BS: Boolean;
  PV: Boolean;
  elementTrackedList: Array<string>;
  classTrackedList:  Array<string>;
  MouseEventList:  Array<string>;
  maxBehaviorRecords: number;
}

export enum Data{
  DomDataList = "DomDataList",
  RouterChangeList = "RouterChangeList",
  PageInformation = "PageInformation",
  OriginInformation = "OriginInformation"
}
