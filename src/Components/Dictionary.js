let statement = Object.freeze({
    CAUSES: 'causes',
    INVOKES: 'invokes',
    AFTER: 'after',
    RELEASES: 'releases',
    TRIGGERS: 'triggers',
    IF: 'if',

})

let logicalSymbols = Object.freeze([
    ['\\\(not\\\)', '¬'],
    ['\\\(and\\\)', '⋀'],
    ['\\\(or\\\)', '⋁'],
])

let logic = Object.freeze({
    AND: '⋀',
    OR: '⋁',
    NOT: '¬'
})

export default {statement, logic, logicalSymbols}