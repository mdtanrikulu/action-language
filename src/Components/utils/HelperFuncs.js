import { logic } from './../LogicDict.js'
import { Statement } from './Tombstone.js'

let temporaryStr = null;

export function charCase(str) {
    temporaryStr = str;
    return str.toLowerCase().replace(/(?:_| |\b)(\w+)/g, function(str, p1) {
        return p1.charAt(0)
    });
}

export function normalizeQuery(query) {
    return temporaryStr.toLowerCase().match(/(?:_| |\b)(\w+)/g).filter(item => item.charAt(0) == query && item)[0];
}

export function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

export function isNull(list, index) {
    return list[index] === null || list[index] === undefined
}

export function createLogicStatement(query) {
    query = replaceAll(query, '⋀', '&')
    query = replaceAll(query, '⋁', '||')
    query = replaceAll(query, '¬', '~')
    query = charCase(query)
    return new Statement(query);
}

export function caseCalculator(query) {

    let statement = createLogicStatement(query)

    var truth = statement.table();
    const {variables, rows} = truth
    return truth && {
            variables: variables.map(item => normalizeQuery(item)),
            rows: rows.filter(item => !!item.eval)
    }
}

export function logicSplitter() {

}