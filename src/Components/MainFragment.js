import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../Actions'

import Timeline from './Timeline.js'


let logicalSymbols = Object.freeze([
    ['\\\(not\\\)', '¬'],
    //['\\\(pi\\\)', 'π'],
    ['\\\(and\\\)', '⋀'],
    ['\\\(or\\\)', '⋁'],
])

let dict = Object.freeze({
    CAUSES: 'causes',
    INVOKES: 'invokes',
    AFTER: 'after',
    RELEASES: 'releases',
    TRIGGERS: 'triggers',
    IF: 'if',

})

class MainFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            error: []
        }
    }

    parseSemantic(dd) {
        let branches = [];
        let tempArray = []
        let filteredDD = dd.filter(item => item.includes(dict.INVOKES) || item.includes(dict.TRIGGERS))
        filteredDD.map(domain => {
            let cause = null;
            let consequence = null;
            let condition = null;
            let step = 0;
            if (domain.includes(dict.INVOKES)) {
                let parsedDomain = domain.split(dict.INVOKES)
                cause = parsedDomain[0].trim()
                let rest = parsedDomain[1].trim()
                if (rest.includes(dict.IF) && rest.includes(dict.AFTER)) {
                    let parseMore = rest.split(dict.AFTER)
                    consequence = parseMore[0].trim()
                    let parseDeeper = parseMore[1].trim()
                    parseDeeper = parseDeeper.split(dict.IF)
                    step = parseInt(parseDeeper[0].trim())
                    condition = parseDeeper[1].trim()
                } else if (rest.includes(dict.IF)) {
                    let parseMore = rest.split(dict.IF)
                    consequence = parseMore[0].trim()
                    condition = parseMore[1].trim()
                } else if (rest.includes(dict.AFTER)) {
                    let parseMore = rest.split(dict.AFTER)
                    consequence = parseMore[0].trim()
                    step = parseInt(parseMore[1].trim())
                } else {
                    consequence = rest.trim()
                }
            } else if (domain.includes(dict.TRIGGERS)) {
                let parsedDomain = domain.split(dict.TRIGGERS)
                cause = parsedDomain[0].trim()
                let rest = parsedDomain[1].trim()
                consequence = rest
            }

            tempArray.push({
                cause,
                consequence,
                step,
                condition
            })
        })
        return tempArray
    }

    _handleInput(e) {
        console.log(e.target.value)
        let body = e.target.value
        let newBody = body;
        for (var i = 0; i < logicalSymbols.length; i++) {
            body = body.replace(new RegExp(logicalSymbols[i][0], 'gi'), logicalSymbols[i][1]);
        }
        if (body !== newBody)
            e.target.value = body
    }

    _handleDraw() {


        let errorCount = 0;
        let branches = [];
        let error = [];
        let action_list = [];
        let observation_list = [];
        let timelineData = [];
        let validValues = []

        const {domainDescription, obs, acs} = this.refs
        let ddArray = domainDescription.value.split(';')
        let releaseCount = (domainDescription.value.match(/releases/g) || []).length;
        releaseCount = releaseCount > 1 ? releaseCount ** 2 - 1 : releaseCount
        let parsedSemanticArray = this.parseSemantic(ddArray)
        let maxPossibleLineAmount = 1;
        let td = null;
        for (let possibleLines = 0; possibleLines < maxPossibleLineAmount + releaseCount; possibleLines++) {
            console.info("===========================================================")
            console.info("DD", domainDescription.value)
            console.info("OBS", obs.value)
            console.info("ACS", acs.value)
            console.info("===========================================================")
            action_list = parseACS(acs.value)
            observation_list = parseOBS(obs.value)
            console.log("ACS LIST", action_list)
            console.log("OBS LIST", observation_list)
            console.info("===========================================================")

            td = createLine(action_list, observation_list, domainDescription.value, possibleLines)
            branches.push(td)
        }

        function checkIfConditionTrue(parsedDomain, currentObservation) {
            let parsedCondition = parsedDomain[1].split(dict.IF)
            let consequence = parsedCondition[0].trim()
            let condition = parsedCondition[1].trim()
            let tempObs = null;
            if (condition.includes("⋀") || condition.includes("⋁")) {
                var domain = condition;
                let reg = new RegExp(/(¬?)\w+/g)
                let sonuc = domain.match(reg)

                var andStr = '⋀';
                var reAnd = new RegExp(andStr, 'g');

                domain = domain.replace(reAnd, '&&');

                var orStr = '⋁';
                var reOr = new RegExp(orStr, 'g');


                domain = domain.replace(reOr, '||');

                currentObservation.forEach(observation => {
                    sonuc.forEach(item => {
                        let cnsSign = 1

                        if (item.startsWith('¬')) {
                            cnsSign = 0
                            item = item.replace("¬", "")
                        }
                        if (observation.sign == cnsSign && observation.value == item) {
                            domain = domain.replace(cnsSign == 0 ? "¬" + item : item, 'true')
                        }
                        if (consequence.includes(observation.value)) {
                            tempObs = observation.sign == 0 ? "¬" + observation.value : observation.value
                        }
                    })

                })
                //domain = domain.replace("¬", "")
                domain = domain.replace("¬hidden", "false")
                domain = domain.replace("¬alive", "false")
                domain = domain.replace("¬loaded", "false")
                domain = domain.replace("hidden", "false")
                domain = domain.replace("alive", "false")
                domain = domain.replace("loaded", "false")
                //domain = domain.replace("¬", "")

                console.log("EVAL " + domain)
                if (eval(domain))
                    return consequence

            } else {
                let result;
                currentObservation.forEach(observation => {
                    let cnsSign = 1
                    let tmpCondition = condition;
                    if (condition.startsWith('¬')) {
                        cnsSign = 0
                        tmpCondition = condition.replace("¬", "")
                    }

                    if (observation.sign == cnsSign && observation.value == tmpCondition) {
                        result = consequence
                    }
                    if (consequence.includes(observation.value)) {
                        result = observation.sign == 0 ? "¬" + observation.value : observation.value
                    }
                })
                return result
            }
            return tempObs
        }

        function createLine(al, ol, dd, possibleLines) {
            timelineData = []
            console.log("AL", al)
            console.log("AL LENGTH", al.length)
            console.info("===========================================================")
            for (let i = 0; i <= al.length; i++) {

                if (i > 20) {
                    throw new Error('There\'s an infitive action case in domain descripton!');
                }
                let instant;
                let val = []
                console.log('OL i', ol[i], i)
                console.info("===========================================================")
                if (ol[i]) {
                    ol[i].forEach(timeline => {
                        Object.keys(timeline).forEach(item => {
                            val.push({
                                value: item.trim(),
                                sign: timeline[item]
                            })
                        })
                    })
                } else {
                    if (typeof al[i - 1] === 'undefined') {
                        validValues.forEach(timeline => {
                            Object.keys(timeline).forEach(item => {
                                val.push({
                                    value: item.trim(),
                                    sign: timeline[item]
                                })
                            })
                        })
                    } else {
                        validValues.forEach(timeline => {

                            Object.keys(timeline).forEach(item => {
                                let itemChanged = false
                                let checkedObservation = checkObservationInDD(dd, al[i - 1], timelineData[i - 1].val)
                                checkedObservation.forEach(observation => {

                                    if (observation && typeof observation === 'string' && observation.includes(item.trim().charAt(0))) {
                                        val.push({
                                            value: item.trim(),
                                            sign: observation.includes('¬') ? 0 : 1
                                        })
                                        itemChanged = true
                                    } else if (observation && Array.isArray(observation) && observation[0].includes(item.trim().charAt(0))) {
                                        // alert('array!')
                                        let nextItem = possibleLines % observation.length
                                        val.push({
                                            value: item.trim(),
                                            sign: observation[nextItem].includes('¬') ? 0 : 1
                                        })
                                        if (possibleLines + 1 < observation.length) {
                                        }
                                        itemChanged = true
                                    }
                                })
                                if (!itemChanged)
                                    val.push({
                                        value: item.trim(),
                                        sign: timeline[item]
                                    })
                            })
                        })
                    }
                }
                if (i > 0) {
                    console.log("EARLIER TIMELINE_DATA", timelineData[i - 1])
                    val.forEach(({value, sign}, index) => {
                        if (value) {
                            console.log({
                                value,
                                sign
                            })
                            validValues[index] = {
                                [value]: sign
                            }
                        }
                    })
                }
                console.log("VALUES", val)
                console.log("VALIDVALUES", validValues)
                console.info("===========================================================")

                instant = {
                    id: i,
                    val,
                    action: al[i] ? al[i] : null

                }
                timelineData.push(instant)
                if (i > 0)
                    checkActionInDD(timelineData[i - 1].action, timelineData[i].val, i)
            }

            return timelineData
        }


        function checkObservationInDD(dd, action, currentObservation) {
            let posibilites = []
            let ddArray = dd.split(';')
            let filteredArray = ddArray.filter(domain => domain.trim().startsWith(action) && (domain.includes(dict.CAUSES) || domain.includes(dict.RELEASES)))
            console.log(filteredArray)
            filteredArray.forEach(item => {
                console.log("EACH ITEM", item)
                posibilites.push(calculatePosibilities(item, currentObservation))
            })

            return posibilites
        }
        function calculatePosibilities(domain, currentObservation) {
            domain = domain.trim();
            let observation;
            if (domain.includes(dict.CAUSES)) {

                let parsedDomain = domain.split(dict.CAUSES)
                let cause = parsedDomain[0].trim()

                if (domain.includes(dict.IF)) {

                    observation = checkIfConditionTrue(parsedDomain, currentObservation)

                } else {
                    observation = parsedDomain[1].trim()
                }
                console.log("observation is ", observation)
                return observation.charAt(0) === '¬' ? observation.substr(0, 2) : observation.charAt(0)
            } else if (domain.includes(dict.RELEASES)) {
                let parsedDomain = domain.split(dict.RELEASES)
                let cause = parsedDomain[0].trim()

                if (domain.includes(dict.IF)) {
                    //TODO
                    observation = checkIfConditionTrue(parsedDomain, currentObservation)

                } else {
                    observation = parsedDomain[1].trim()
                }
                console.log("observation is ", observation)
                return observation.charAt(0) === '¬' ? [observation.substr(0, 2), observation.charAt(1)] : [observation.charAt(0), "¬" + observation.charAt(0)]
            }
        }



        function checkActionInDD(acs, currentObservation, currentIndex) {
            console.log("acs, currentObservation, currentIndex", acs, currentObservation, currentIndex);
            parsedSemanticArray.forEach((item) => {
                if (item.cause === acs) {
                    writeInTimeline(item, currentObservation, currentIndex)
                }
            })
        }

        function writeInTimeline(semantic, obs, index) {
            console.log("timelineData", timelineData);
            let cnd = semantic.condition
            if (cnd) {
                if (cnd.includes('⋁') || cnd.includes('⋀')) {
                    //TODO
                } else {
                    let cndSign = 1
                    if (cnd.includes('¬')) {
                        cndSign = 0
                        cnd = cnd.replace('¬', '')
                    }
                    obs.forEach(item => {
                        if (item.value === cnd && item.sign === cndSign) {
                            if (semantic.step < 1)
                                timelineData[index + semantic.step].action = semantic.consequence
                            if (action_list[index + semantic.step] != null) {
                                error[errorCount++] = {
                                    message: `The timeline is inconsistent because ${action_list[index + semantic.step]} and ${semantic.consequence} overlapped in moment ${index + semantic.step}`
                                }
                            }
                            action_list[index + semantic.step] = semantic.consequence
                        }
                    })
                }
            } else {
                if (semantic.step < 1)
                    timelineData[index + semantic.step].action = semantic.consequence
                action_list[index + semantic.step] = semantic.consequence
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
                    error[errorCount++] = {
                        message: `The timeline is inconsistent because ACS has more than one action in the same moment.`
                    }
                }
                result[parseInt(matches[1].split(',')[1])] = matches[1].split(',')[0]
            }

            return result
        }

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
                let valuesArr = matches[1].split(',')[0].split('∧')
                valuesArr.forEach((item, index) => {
                    item = item.trim()
                    if (item.includes('¬')) {
                        valuesArr[index] = {
                            [item.replace('¬', '')]: 0
                        }
                    } else {
                        valuesArr[index] = {
                            [item]: 1
                        }
                    }
                })
                result[parseInt(matches[1].split(',')[1])] = valuesArr
                if (valuesArr.length >= validValues.length) {
                    validValues = valuesArr
                }
            }

            return result
        }

        const mockData = [
            {
                id: 0,
                val: ['a', '¬l', '¬h'],
                action: null
            },
            {
                id: 1,
                val: ['a?', 'l?', 'h?'],
                action: 'Load'
            },
            {
                id: 2,
                val: ['a?', 'l*', 'h?'],
                action: 'Escape'
            },
            {
                id: 3,
                val: ['a?', 'l?', 'h*'],
                action: 'Shoot'
            },
            {
                id: 4,
                val: ['a?', '¬l*', 'h?'],
                action: null
            }
        ]
        this.setState({
            branches,
            error
        })
    }

    drawTimeline(branches, error) {
        console.log("BRANCHES", branches)
        return branches.map((branch, index) => <Timeline key={index.toString()} data={branch} error={error[index]} amount={index + 1}/>)
    }

    // <span>π (pi)</span>
    render() {
        const {actions, status, search, signIn} = this.props;
        const {branches, error} = this.state
        return (
            <div className="main-fragment">
              <div className="main-fragment-content">
              <div className="tooltip-section__main">
                  <span>¬ (not)</span>
                  <span>⋀ (and) </span>
                  <span>⋁ (or)</span>
              </div>
              <div className="entry-section__main">
                <div>
                    <label>Domain Description</label>
                    <textarea ref="domainDescription" className="domain-description-input__main" onChange={::this._handleInput} defaultValue="LOAD causes loaded;
SHOOT causes ¬loaded;
SHOOT causes ¬alive if ¬hidden ⋀ loaded;
LOAD invokes ESCAPE if loaded;
ESCAPE releases hidden." rows={8}/>
                </div>
                <div>
                    <label>Scenario (OBS)</label>
                    <input ref="obs" className="scenario-input__main"  onChange={::this._handleInput} defaultValue="{(alive ∧ ¬loaded ∧ ¬hidden, 0)}"/>
                    <label>Scenario (ACS)</label>
                    <input ref="acs" className="scenario-input__main" defaultValue="{(LOAD,1),(SHOOT,3)}"/>
                </div>
              </div>
                <button onClick={::this._handleDraw}>Draw</button>
                <div className="panel__timeline">
                {branches.length > 0 && this.drawTimeline(branches, error)}
                </div>
              </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MainFragment)