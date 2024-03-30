import {type CatchData} from '../types/performance'
export function cache():CatchData {
    const resourceDatas = performance.getEntriesByType('resource');
    let cacheHitQuantity = 0;
    resourceDatas.forEach((resourceData) => {
      if ((resourceData as any).deliveryType === 'cache') cacheHitQuantity++;
      else if (resourceData.duration === 0 && resourceData.transferSize !== 0) cacheHitQuantity++;
    })

    const cacheHitRate:number = cacheHitQuantity !== 0 && resourceDatas.length !== 0? parseFloat((cacheHitQuantity / resourceDatas.length * 100).toFixed(2)) : 0
    return {
      cacheHitQuantity,
      noCacheHitQuantity: resourceDatas.length - cacheHitQuantity,
      cacheHitRate:  `${cacheHitRate}%`,
    };
  }
  