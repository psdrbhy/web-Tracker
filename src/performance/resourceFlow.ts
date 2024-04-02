import { type ResourceFlow } from '../types/performance';

export function resourceFlow():ResourceFlow[] {
    const resouceDatas = performance.getEntriesByType('resource');
    return resouceDatas.map((resourceData:PerformanceResourceTiming) => {
      const {
        name,
        transferSize,
        initiatorType,
        startTime,
        responseEnd,
        domainLookupEnd,
        domainLookupStart,
        connectStart,
        connectEnd,
        secureConnectionStart,
        responseStart,
        requestStart,
      } = resourceData;
  
      return {
        name,
        initiatorType,
        transferSize,
        start: startTime,
        end: responseEnd,
        DNS: domainLookupEnd - domainLookupStart,
        TCP: connectEnd - connectStart,
        SSL: connectEnd - secureConnectionStart,
        TTFB: responseStart - requestStart,
        Trans: responseEnd - requestStart,
      };
    });
  }