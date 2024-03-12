import { ReportTracker } from '../types/error';
export default function targetKeyReport(reportTracker: ReportTracker) {
  // 需要监听的事件
  const MouseEventList: string[] = [
    'click',
    'dblclick',
    'contextmenu',
    'mousedown',
    'mouseup',
    'mouseenter',
    'mouseout',
    'mouseover',
  ];
  MouseEventList.forEach((event) => {
    window.addEventListener(
      event,
      (e) => {
        const target = e.target as HTMLElement;
        const targetKey = target.getAttribute('target-key');
        // 看dom上有没有这个属性，如果有就进行上报
        if (targetKey) {
            reportTracker({
            kind: 'stability',
            trackerType: 'domTracker',
            event,
            targetKey,
            // selector:e? getSelector(e) : '' //代表最后一个操作的元素
          });
        }
      },
      {
        capture: true, //捕获：为了让获得的是最底层的那个，也是为了实现那个路径的功能
        passive: true, //性能优化
      },
    );
  });
}
