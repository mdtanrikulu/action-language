import { store } from './../main.js'
import { caseCalculator } from './utils/HelperFuncs.js'

class Observation {
    constructor(sign, value) {
        this.sign = sign;
        this.value = value;
    }

    toHR() {
        return this.sign == 0 ? `¬${this.value}` : this.value
    }
}
/**
 * [parseOBS function]
 * @param  {String} val [value of the OBS input]
 * @return {Array}     [Array of OBS values]
 */
function parseOBS(val, observationHistory) {
    let result = [];
    let regExp = /\(([^()]+)\)/g;
    let matches;
    let observationList = [];
    while (matches = regExp.exec(val)) {
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
        console.log("observationList", observationList);
        store.dispatch({
            type: 'OBSERVATION_HISTORY',
            payload: observationList
        })
    }

    return result
}

export default parseOBS