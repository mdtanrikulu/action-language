import { store } from './../main.js'
import { caseCalculator } from './utils/HelperFuncs.js'
import Observation from './objects/Observation.js'
/**
 * [parseOBS function]
 * @param  {String} val [value of the OBS input]
 * @return {Array}     [Array of OBS values]
 */
function parseOBS(val) {
    let result = [];
    let regExp = /\(([^()]+)\)/g;
    let matches;
    while (matches = regExp.exec(val)) {
        let observationList = [];
        let cases = caseCalculator(matches[1].split(',')[0]);
        cases.rows.forEach((row, indexRow) => {
            let possibility = [];
            cases.variables.forEach((variable, indexVariable) => {
                if (row[variable.charAt(0)]) {
                    possibility[indexVariable] = new Observation(1, variable)
                } else {
                    possibility[indexVariable] = new Observation(0, variable)
                }
            })
            observationList[indexRow] = possibility
        })
        result[parseInt(matches[1].split(',')[1])] = observationList
    }

    return result
}

export default parseOBS