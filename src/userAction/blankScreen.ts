import { ReportTracker } from '../types/error';
export class BlankScreenTracker {
  private isSkeleton: boolean
  private whiteLoopNum: number
  private loopTimer: number
  private initSkeletonList: any = []
  private currentSkeletonList: any = []
  private reportTracker: ReportTracker;
  constructor(reportTracker: ReportTracker, isSkeleton) {
    this.reportTracker = reportTracker;
    this.isSkeleton = isSkeleton
    this.whiteLoopNum = 0

    this.load();
  }
  private load() {
    // 页面状态为complete才进行
    if (this.isSkeleton) { //看是否有骨架屏
      if (document.readyState != 'complete') { //没渲染完成就进行采样对比
        this.samplingOptimization()
      }
    } else {
      if (document.readyState === 'complete') {
        this.samplingOptimization();
      } else {
        window.addEventListener('load', () => {
          this.samplingOptimization();
        });
      }
    }


  }

  private sampling() {
    let emptyPoints = 0 //初次的空白点
    for (let i = 0; i < 9; i++) {
      let XElement = document.elementFromPoint(
        (window.innerWidth * i) / 10,
        window.innerHeight / 2,
      );
      let YElement = document.elementFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10,
      );
      if (this.isWrapper(XElement)) emptyPoints++;
      // 第二次中心点不需要再检测
      if (i != 5) {
        if (this.isWrapper(YElement)) emptyPoints++
      }
    }
    // 骨架屏的时候我怎么判断是否渲染好然后进行对比呢
    // 说明没有白屏就不再需要轮训
    if (emptyPoints != 17) {
      if (this.isSkeleton) {
        if (!this.whiteLoopNum) return this.whiteScreenLoop() //初始化不对比
        //相同说明白屏
        if (this.currentSkeletonList.join() == this.initSkeletonList.join()) {
          // 直接进行上报
          this.whiteScreenReport(emptyPoints)

        }
      }
    } else { //这种情况是没有骨架屏然后显示白屏,我们开启轮询修正
      this.whiteScreenLoop()
    }

    if (emptyPoints == 17) { //说明白屏了
      // 在这里就可以进行上报
      this.whiteScreenReport(emptyPoints)
    }
  }
  /**
 * 轮询:这里的问题是你怎么控制骨架屏的情况下，页面是渲染好了的，我这里定时器给了1000
 */
  private whiteScreenLoop() {
    this.loopTimer = setInterval(() => {
      if (this.isSkeleton) {
        this.whiteLoopNum++
        this.currentSkeletonList = []
      }
      this.samplingOptimization()
    }, 1000)
  }


  /**
 * 判断是否白点
 */
  private isWrapper(element?: Element | null) {
    let WrapperElement = ['html', 'body', '#container', '.content'];
    let selector = this.getSelector(element) as string;
    if (this.isSkeleton) {
      this.initSkeletonList ? this.currentSkeletonList.push(selector) : this.initSkeletonList.push(selector)
    }
    return WrapperElement.indexOf(selector) != -1
  }
  /**
* 获取选中dom的标识
*/
  private getSelector<T extends Element | null | undefined>(element: T) {
    if (element?.id) {
      return '#' + element.id;
    } else if (element?.className) {
      // 处理一个dom上面class可能多个的问题
      let className = element.className
        .split(' ')
        .filter((item) => !!item)
        .join('.');
      return '.' + className;
    } else {
      return element?.nodeName.toLowerCase();
    }
  }
  /**
* 上报
*/

  private whiteScreenReport(emptyPoints:number) {
    let centerElement = document.elementFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
    this.reportTracker({
      kind: 'userAction',
      trackerType: 'blank',
      emptyPoint: emptyPoints,
      screen: window.screen.width + 'X' + window.screen.height,
      viewPoint: window.innerWidth + 'X' + window.innerHeight,
      selector: this.getSelector(centerElement), //放中间元素
    });
  }
    /**
* 采样优化
*/
  private samplingOptimization() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(deadline => {
        // timeRemaining：表示当前空闲时间的剩余时间
        if (deadline.timeRemaining() > 0) { //有空闲时间就采样，这样可以确保在浏览器空闲的时候才进行采样
          this.sampling();
        }
      });
    } else {
      this.sampling()
    }
  }


  
}





