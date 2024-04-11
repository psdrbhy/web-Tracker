import { BlankScreenTracker } from './BlankScreen';
import { ReportTracker } from '../types/error';
import { targetKeyReport } from './Dom';
import { trackRouterChange } from './RouterChange';
import { OriginInformation } from './originInformation';
import { PageInformation } from './pageInformation';
import { utcFormat } from '../utils/timeFormat';

import { HehaviorStackData, Options, RouterData,Data } from '../types/userAction';
export class userAction {
  private options: Options;
  private data: Record< Data | string, Record<string, any>>;
  private hehaviorStackDataList: Array<HehaviorStackData>;
  private reportTracker: ReportTracker;
  constructor(reportTracker: ReportTracker) {
    this.options = this.initDef();
    this.data = {}
    this.reportTracker = reportTracker;


    this.eventTracker();
  }

  //默认设置
  private initDef() {
    // 重写赋值
    return {
      PI: true,
      OI: true,
      RCR: true,
      DBR: true,
      HT: true,
      BS: true,
      PV: true,
      elementTrackedList: ['button', 'div'],
      classTrackedList: ['tracked'],
      MouseEventList: ['click'],
      maxBehaviorRecords: 100,
    };
  }
  public eventTracker() {
    this.BlankScreen();
    this.RouterChange();
    this.pageData();
  }
  public BlankScreen() {
    new BlankScreenTracker(this.reportTracker);
  }
  public Dom() {
    // targetKeyReport(this.reportTracker);
    targetKeyReport((e, event) => {
      const domData = {
        // tagInfo: {
        //     id: target.id,
        //     classList: Array.from(target.classList),
        //     tagName: target.tagName,
        //     text: target.textContent,
        //   },
        pageInfo: PageInformation(),
        time: new Date().getTime(),
        timeFormat: utcFormat(new Date().getTime()),
      };
      this.data[Data.DomDataList].push(domData);

      const target = e.target as HTMLElement;
      const targetKey = target.getAttribute('target-key');
      // 看dom上有没有这个属性，如果有就进行上报
      if (targetKey) {
        this.reportTracker({
          kind: 'stability',
          trackerType: 'domTracker',
          event,
          targetKey,
          // selector:e? getSelector(e) : '' //代表最后一个操作的元素
        });
      }
    }, this.options.MouseEventList);
  }
  public RouterChange() {
    trackRouterChange((e) => {
      const routerData: RouterData = {
        routerType: e.type,
        pageInfo: PageInformation(),
        time: new Date().getTime(),
        timeFormat: utcFormat(new Date().getTime()),
      };
      this.data[Data.RouterChangeList].push(routerData);
      const hehaviorStackData: HehaviorStackData = {
        name: 'RouterChange',
        page: PageInformation().pathname,
        value: {    
          Type: e.type,
        },
        time: new Date().getTime(),
        timeFormat: utcFormat(new Date().getTime()),
      };
      this.hehaviorStackDataList.push(hehaviorStackData);
      // 当路由发生变化就重新上报页面数据
      this.pageData();
    });
  }
  public pageData() {
    const pageData = {
      pageInformation: PageInformation(),
      originInformation: OriginInformation(),
    };
    this.data[Data.PageInformation] = PageInformation(),
    this.data[Data.OriginInformation] = OriginInformation(),
    this.reportTracker(pageData);
  }
}
