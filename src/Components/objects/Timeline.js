import {isNull} from './../utils/HelperFuncs.js'
import Action from './Action.js'
class Timeline {
    constructor(actionList) {
        this.time           = 0
        this.timePoints     = []
        this.history        = []
        this.actionList     = actionList
        this.consistency    = true
    }

    getTime() {
        return this.time
    }

    updateTime() {
        this.time = this.time + 1
    }

    getActionList() {
        return this.actionList
    }

    updateActionList(action, index) {
        if (isNull(this.actionList, index))
            this.actionList[index] = new Action(action)
        else
            console.warn('inconsistent')
    }

    addTimePoint(timePoint) {
        this.timePoints.push(timePoint)
        this.updateTime()
    }

    setConsistency(status) {
        this.consistency = status
    }

    getConsistency() {
        return this.consistency
    }

    setHistory(history){
        this.history = history
    }

    getHistory(){
        return this.history
    }
}

export default Timeline