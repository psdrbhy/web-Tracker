import {BehaviorStackData} from '../types/userAction'
export class BehaviorStack {
    private behaviorStackList:Array<BehaviorStackData>
    private readonly maxStackLength:number
    constructor(maxStackLength:number){
        this.maxStackLength =  maxStackLength
        this.behaviorStackList = []
    }
    set(data:BehaviorStackData){
        if(this.behaviorStackList.length == this.maxStackLength) {
            this.behaviorStackList.shift()
        }
        this.behaviorStackList.push(data)
    }
    get(){
        return this.behaviorStackList
    }
    clear(){
        this.behaviorStackList = []
    }
}