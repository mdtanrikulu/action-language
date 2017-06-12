import { store } from './../main.js'
import { createLogicStatement } from './utils/HelperFuncs.js'

function conditionCheck(query) {
    let result = []
    let statement = createLogicStatement(query) // domain
    let observationHistory = store.getState().timeline.observationHistory //senaryo
    console.log("BOKLOG1", observationHistory)
    console.log("BOKLOG1", statement)
    //TODO
    result.push(statement.evaluate({
        'a': !!0,
        'h': !!0,
        'l': !!0
    }))
    return result
}
export default conditionCheck