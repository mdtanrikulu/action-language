var _ = require('lodash')
import { logic } from './../Dictionary.js'
import { Statement } from './Tombstone.js'
import Observation from './../objects/Observation.js'

let temporaryStr = null;

export function charCase(str) {
    temporaryStr = str;
    return str.toLowerCase().replace(/(?:_| |\b)(\w+)/g, function(str, p1) {
        return p1.charAt(0)
    });
}

Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
    return -1;
}

function deepOmit(obj, keysToOmit) {
  var keysToOmitIndex =  _.keyBy(Array.isArray(keysToOmit) ? keysToOmit : [keysToOmit] ); // create an index object of the keys that should be omitted

  function omitFromObject(obj) { // the inner function which will be called recursivley
    return _.transform(obj, function(result, value, key) { // transform to a new object
      if (key in keysToOmitIndex) { // if the key is in the index skip it
        return;
      }

      result[key] = _.isObject(value) ? omitFromObject(value) : value; // if the key is an object run it through the inner function - omitFromObject
    })
  }
  
  return omitFromObject(obj); // return the inner function result
}

export function caseToObject(caseObject){
    let rows = caseObject.rows;
    let variables = caseObject.variables;
    rows = deepOmit(rows, ['eval'])
    return rows.map( row => 
            Object.keys(row).map(key => {
                return new Observation(+ row[key], variables.filter( item => item.charAt(0) == key )[0])
            })
        )
}

export function queryToObject(query) {
    var re = /(¬?)(?:⋁||⋀||\b)(\w+)/g;
    let match;
    let result = [];
    while (match = re.exec(query)) {
        let sign = match[1] != "" ? 0 : 1
        let value = match[2]
        let matched_object = {
            sign,
            value
        }
        result.push(matched_object)
    }

    return result
}

export function normalizeQuery(query) {
    return temporaryStr.toLowerCase().match(/(?:_||\b)(\w+)/g).filter(item => item.charAt(0) == query && item)[0];
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