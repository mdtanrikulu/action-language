import { store } from './../main.js'
import { createLogicStatement, queryToObject } from './utils/HelperFuncs.js'

function checkIfMatch(observationList, query) {

    return observationList.some((observation) => {
        return observation.value == query.value && observation.sign == query.sign
    })

}

function conditionCheck(query, observationList) {

    let statement = createLogicStatement(query) // domain
    let queryObjects = queryToObject(query)

        let queryStatus = queryObjects.map(query => {
            return {
                [query.value.charAt(0)]: checkIfMatch(observationList, query) ? !!query.sign : !query.sign
            }
        })

        console.log("queryStatus", queryStatus);
        let merged = Object.assign(...queryStatus);
        console.log("merged", merged);

        

    return statement.evaluate(merged)
}

export {conditionCheck as default}