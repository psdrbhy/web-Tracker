import Tracker from '../core/index';

export type ReportTracker = Tracker['reportTracker'];

export interface ResourceData {
  name: string;
}

export interface ResourceFlow {
  name: string;
  initiatorType: string;
  transferSize: number;
  start: number;
  end: number;
  DNS: number;
  TCP: number;
  SSL: number;
  TTFB: number;
  Trans: number;
}

/**
 * @DNS DNS查询耗时
 * @SSL SSL安全连接耗时
 * @TCP TCP连接耗时
 * @TTFB 请求响应耗时
 * @Trans 内容传输耗时
 * @FP 白屏时间                                     从请求开始到浏览器开始解析第一批HTML文档字节的时间。
 * @DOMParse DOM解析耗时
 * @TTI 首次可交互时间                               浏览器完成所有HTML解析
 * @DomReady HTML加载完成时间也就是 DOM Ready 时间    单页面客户端渲染下，为生成模板dom树所花费时间；非单页面或单页面服务端渲染下，为生成实际dom树所花费时间'
 * @Res 资源加载耗时
 * @Load 页面完全加载时间                            Load=首次渲染时间+DOM解析耗时+同步JS执行+资源加载耗时。
 */
export interface LoadingData {
  DNS: { start: number; end: number; value: number };
  SSL: { start: number; end: number; value: number };
  TCP: { start: number; end: number; value: number };
  TTFB: { start: number; end: number; value: number };
  Trans: { start: number; end: number; value: number };
  FP: { start: number; end: number; value: number };
  DomParse: { start: number; end: number; value: number };
  TTI: { start: number; end: number; value: number };
  DomReady: { start: number; end: number; value: number };
  Res: { start: number; end: number; value: number };
  Load: { start: number; end: number; value: number };
}

export interface MetricDataDetail {
  name: string;
  value: number;
  rating: string;
}
export interface CatchData {
  cacheHitQuantity: number;
  noCacheHitQuantity: number;
  cacheHitRate: string;
}

export enum MetricData {
  FCP = 'FCP',
  LCP = 'LCP',
  FID = 'FID',
  CLS = 'CLS',
}

export interface DefaultOptions {
  performance:Boolean,
  cache:Boolean,
  loading:Boolean,
  resourceFlow:Boolean
}

export interface Options extends Partial<DefaultOptions> {
  
}

export enum Data{
  performance = "performance",
  cache = "cache",
  loading = 'loading',
  resourceFlow = 'resourceFlow'
}
