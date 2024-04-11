import {
  onFCP,
  onCLS,
  onLCP,
  onFID,
  type FCPMetric,
  type LCPMetric,
  type FIDMetric,
  type CLSMetric,
} from 'web-vitals';

import { MetricData,MetricDataDetail } from '../types/performance';
export function WebVitals(callback:(data:Record<string, MetricDataDetail>)=>void) {
  let data:Record<string, MetricDataDetail> = {}
  let callbackCount = 0;
  onFCP((metricData: FCPMetric) => {
    data[MetricData.FCP] = {
      name: metricData.name,
      value: metricData.value,
      rating: metricData.rating,
    };
    callbackCount++
    checkAndCallback()

  })
  onCLS((metricData: CLSMetric) => {
    data[MetricData.CLS] = {
      name: metricData.name,
      value: metricData.value,
      rating: metricData.rating,
    };
    callbackCount++
    checkAndCallback()
  })

  onLCP((metricData: LCPMetric) => {
    data[MetricData.LCP] = {
      name: metricData.name,
      value: metricData.value,
      rating: metricData.rating,
    };
    callbackCount++
    checkAndCallback()
  });
  onFID((metricData: FIDMetric) => {
    data[MetricData.FID] = {
      name: metricData.name,
      value: metricData.value,
      rating: metricData.rating,
    };
    callbackCount++
    checkAndCallback()
  });
  function checkAndCallback() {
    if (callbackCount === 4) {
      callback(data);
    }
  }

}