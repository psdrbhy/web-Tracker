export function domTracker(handler: (...args: any[]) => any,eventTrackedList:string[]) {
  // 需要监听的事件
  const MouseEventList: string[] = eventTrackedList
  MouseEventList.forEach((event) => {
    window.addEventListener(
      event,
      (e)=>handler(e,event),
      {
        capture: true, //捕获：为了让获得的是最底层的那个，也是为了实现那个路径的功能
        passive: true, //性能优化
      },
    );
  });
}
