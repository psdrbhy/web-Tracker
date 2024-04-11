import { type OriginInformation } from '../types/userAction';

export function OriginInformation(): OriginInformation {
  return {
    referrer: document.referrer,
    type: performance.getEntriesByType('navigation')[0].type,
  };
}
