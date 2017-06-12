import { store } from './../main.js'
import { isNull, logicSplitter } from './utils/HelperFuncs.js'
import conditionCheck from './ConditionChecker.js'

class Timeline {
    constructor() {
        this.time = 0
        this.lines = []
    }

    getTime() {
        return this.time
    }

    updateTime() {
        this.time = this.time + 1
    }

    createTime(moment) {
        this.lines.push(moment)
        this.updateTime()
    }
}

class Moment {
    constructor() {
        this.action;
        this.observation;
    }

    setAction(action) {
        this.action = action
    }

    setObservartion(observation) {
        this.observation = observation
    }
}

function timelineHelper(observationList, actionList) {
    console.log("observationHistory", store.getState().timeline.observationHistory);
    console.log("actionList", actionList);
    console.log("observationList", observationList);
    let endOfTimeline = false;
    let timeline = new Timeline()

    console.log(conditionCheck('alive ⋁ ¬hidden ⋀ loaded'))

    while (!endOfTimeline) {
        let moment = new Moment()
        if (!isNull(observationList, timeline.getTime())) {
            moment.setObservartion(observationList[timeline.getTime()])
        }

        timeline.createTime(moment)
        endOfTimeline = true;
    }

    return timeline;
}

export default timelineHelper