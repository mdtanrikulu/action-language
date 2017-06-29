var _ = require('lodash')
import { store } from './../main.js'
import { isNull, logicSplitter, queryToObject, createLogicStatement, caseCalculator, caseToObject } from './utils/HelperFuncs.js'
import conditionCheck from './ConditionChecker.js'
import dict from './Dictionary.js'
import Timeline from './objects/Timeline.js'
import TimePoint from './objects/TimePoint.js'
import Observation from './objects/Observation.js'

function timelineHelper(observationList, actionList, domainDescription) {

    console.log("actionList", actionList);
    console.log("observationList", observationList);
    console.log("domainDescription", domainDescription);

    let endOfTimeline = false;

    //console.log('conditionCheck', conditionCheck('alive ⋀ ¬loaded ⋀ ¬hidden'))
    let first = true;
    let caseAmount      = (observationList[0].length) || 1
    let branches        = new Array(caseAmount).fill(new Timeline(actionList))
    console.log("branches first", branches);
    let count = 0
    for (var index = 0; index < branches.length; index++){
    // branches.forEach((timeline, index) => {


        while (!endOfTimeline) {

            let timeline = branches[index];
            let observationHistory  = timeline.getHistory();
            let timePointClones     = []
            let timelineClones      = []
            let time                = timeline.getTime()
            let timePoint           = new TimePoint()
            let observation         = (observationList[index] && observationList[index][time]) || _.cloneDeep(observationHistory) || []
            console.log("observation asdasd", observation);
            let privateActionList   = timeline.getActionList()

            timePoint.setObservartion(observation)
            timePoint.setAction(privateActionList[time])


            let triggersTODO    = domainDescription.filter((item) => item.statement == dict.statement.TRIGGERS && item)

            if(time > 0){
                let previousAction = privateActionList[time - 1]
                //let previousAction = "LOAD";
                if (previousAction){

                    let causesTODO      = domainDescription.filter((item) => (item.statement == dict.statement.CAUSES && item.cause == previousAction.name) && item)
                    let releasesTODO    = domainDescription.filter((item) => (item.statement == dict.statement.RELEASES && item.cause == previousAction.name) && item)
                    let invokesTODO     = domainDescription.filter((item) => (item.statement == dict.statement.INVOKES && item.cause == previousAction.name) && item)

                    if(causesTODO.length === 0) {
                        timePointClones.push(timePoint)
                    }
                    /*
                     * CAUSES IMPLEMENTATION
                     */
                    causesTODO.forEach( ({fluent, condition}) => {

                        let doable = true;

                        if(condition){
                            doable = conditionCheck(condition, observationHistory)
                        }

                        if(doable){
                            let result      = caseCalculator(fluent)
                            result          = caseToObject(result)

                            console.log("CAUSEresult", result);
                            result.forEach( obs => {

                                let cloneTimePoint  = _.cloneDeep(timePoint)
                                let cloneOBS        = cloneTimePoint.getObservation()

                                obs.forEach( item => {
                                    let obsIndex        = cloneOBS.getIndexBy("value", item.value)
                                    if(obsIndex == -1) obsIndex = 0
                                    cloneOBS[obsIndex]  = item
                                })

                                cloneTimePoint.setObservartion(cloneOBS)
                                timePointClones.push(cloneTimePoint)
                            })

                            console.log("CAUSE END", timePointClones)
                        }
                    })

                    /*
                     * RELEASES IMPLEMENTATION
                     */
                    
                    releasesTODO.forEach( ({fluent, condition}) => {
                        console.log("10.condition", condition);
                        console.log("10.fluent", fluent);
                        let doable = true;

                        if(condition){
                            doable = conditionCheck(condition, observationHistory)
                        }

                        if(doable){
                                console.log("timePointClones", timePointClones);
                            let clonesNegative = timePointClones.map(timePoint => {
                                console.log("negative timePoint", timePoint);
                                    let tp = _.cloneDeep(timePoint)
                                    let cloneOBS        = tp.getObservation()
                                    let obsIndex        = cloneOBS.getIndexBy("value", fluent)
                                    console.log("obsIndex", obsIndex);
                                    cloneOBS[obsIndex]  = new Observation(0, fluent)
                                    tp.setObservartion(cloneOBS)
                                    return tp
                            })

                            let clonesPositive = timePointClones.map(timePoint => {
                                console.log("positive timePoint", timePoint);
                                    let tp = _.cloneDeep(timePoint)
                                    let cloneOBS        = tp.getObservation()
                                    let obsIndex        = cloneOBS.getIndexBy("value", fluent)
                                    cloneOBS[obsIndex]  = new Observation(1, fluent)
                                    tp.setObservartion(cloneOBS)
                                    return tp
                            })

                            console.log("clonesNegative", clonesNegative);
                            console.log("clonesPositive", clonesPositive);
                            console.log("timePointClones", timePointClones);
                            timePointClones = clonesPositive.concat(clonesNegative)
                            console.log("clones Releases end", timePointClones);
                        }

                        
                    })

                    /*
                     * INVOKES IMPLEMENTATION
                     */
                     for (let i = 0; i < timePointClones.length; i++) {
                        let cloneTimeline = _.cloneDeep(timeline)

                        timelineClones.push(cloneTimeline)
                     }

                    console.log("timelineClones", timelineClones);
                    
                    invokesTODO.forEach( ({fluent, condition, step}) => {
                        let doable = true;

                        if(condition){
                            doable = conditionCheck(condition, observationHistory)
                        }

                        if(doable){
                            if(step && !_.isNumber(step)){
                                step = _.findIndex(privateActionList, (element, index) => (element && element.name == step), time - 1)
                            }
                            timelineClones = timelineClones.map( cloneTimeline => {
                                let tl = _.cloneDeep(cloneTimeline)
                                tl.updateActionList(fluent, (time - 1) + (step ? step : 1))
                                return tl
                            })
                        }
                        
                    })
                } else {
                    timeline.addTimePoint(timePoint)
                    timeline.setHistory(observation)
                }
            } else {
                timeline.addTimePoint(timePoint)
                timeline.setHistory(observation)
            }
            
            /**
             * TRIGGER IMPLEMENTATION
             */
            triggersTODO.forEach(({cause, fluent}) => {
                debugger;
                let result = conditionCheck(cause, observation)
                if(result) {
                    timelineClones.map( cloneTimeline => {
                        let tl = _.cloneDeep(cloneTimeline)
                        tl.updateActionList(fluent, time)
                        return tl
                    })
                }
            })

            timelineClones = timelineClones.map((timelineClone, index) => {
                console.info("timelineClone", timelineClone);
                console.log("timePointClones[index]", timePointClones[index]);
                let tlc = _.cloneDeep(timelineClone)
                tlc.addTimePoint(timePointClones[index])
                tlc.setHistory(timePointClones[index].getObservation())
                return tlc
            })
            console.log("timelineClones after", timelineClones);

            if(timelineClones.length > 0){
                timeline.addTimePoint(timePoint)
                timeline.setHistory(observation)
                branches = branches.concat(timelineClones.slice(1, timelineClones.length))
            }
            if(time == privateActionList.length){
                endOfTimeline = true;
            }
        }

}
    // })
    
    console.log("BIG RESULT", branches)

    return branches;
}

export default timelineHelper