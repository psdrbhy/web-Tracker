// 重写pushState和replaceState:因为history监听不到
export const createHistoryEvent = <T extends keyof History>(type: T) => {
  //获取到函数
  const orign = history[type];
  return function (this: any) {
    //这里的this是一个假参数
    const res = orign.apply(this, arguments);
    // 创建事件
    const e = new Event(type);
    // 派发事件
    window.dispatchEvent(e);

    return res;
  };
};

// window.addEventListener
// createHistoryEvent("pushState")
