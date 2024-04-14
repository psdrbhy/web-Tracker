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
