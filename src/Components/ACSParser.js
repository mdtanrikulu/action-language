import { store } from './../main.js'
class Action {
    constructor(name) {
        this.name = name
    }
}
/**
 * [parseACS function]
 * @param  {String} val [value of the ACS input]
 * @return {Array}     [Array of ACS values]
 */
function parseACS(val) {
    let result = [];
    let regExp = /\(([^()]+)\)/g;
    let matches;
    while (matches = regExp.exec(val)) {
        if (result[parseInt(matches[1].split(',')[1])] != null) {
            store.dispatch({
                type: 'ERROR',
                payload: 'The timeline is inconsistent because ACS has more than one action in the same moment.'
            })
        }
        let action = new Action(matches[1].split(',')[0]);
        result[parseInt(matches[1].split(',')[1])] = action
    }

    return result
}

export default parseACS