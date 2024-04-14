import Tracker from '../core/index'



export type ReportTracker = Tracker['reportTracker'];

/**
 * @js js Error
 * @resource resource Error
 * @promise promise Error 
 * @http http Error
 * @BlankScreen BlankScreen:出现白屏现象
 */
export interface DefaultOptions {
    js:Boolean,
    resource:Boolean,
    promise:Boolean,
    http:Boolean,
    BlankScreen:Boolean,

}

export interface Options extends Partial<DefaultOptions> {

}