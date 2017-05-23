import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../Actions'

import Timeline from './Timeline.js'


let logicalSymbols = Object.freeze([
    ['\\\(not\\\)', '¬'],
    ['\\\(pi\\\)', 'π'],
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

let action_list = [];
let observation_list = [];
let timelineData = [];
let validValues = []

class MainFragment extends React.Component {

    constructor(props) {
        super(props);
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

        const {domainDescription, obs, acs} = this.refs
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


        checkActionInDD(domainDescription.value)

        let td = createLine(action_list, observation_list, domainDescription.value)

        function createLine(al, ol, dd) {
            timelineData = []
            console.log("AL", al)
            console.log("AL LENGTH", al.length)
            console.info("===========================================================")
            for (let i = 0; i <= al.length; i++) {
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
                                let checkedObservation = checkObservationInDD(dd, al[i - 1])[0]
                                if (checkedObservation.includes(item.trim().charAt(0))) {
                                    console.log("***", checkedObservation)

                                } else {
                                    val.push({
                                        value: item.trim(),
                                        sign: timeline[item]
                                    })
                                }
                            })
                        })
                    }
                }
                val.forEach(item => {
                })
                console.log("VALUES", val)
                console.log("VALIDVALUES", val)
                console.info("===========================================================")

                instant = {
                    id: i,
                    val,
                    action: al[i] ? al[i] : null

                }
                timelineData.push(instant)
            }

            return timelineData
        }


        function checkObservationInDD(dd, action) {
            let posibilites = []
            let ddArray = dd.split(';')
            let filteredArray = ddArray.filter(domain => domain.trim().startsWith(action) && (domain.includes(dict.CAUSES) || domain.includes(dict.RELEASES)))
            console.log(filteredArray)
            filteredArray.forEach(item => {
                console.log("EACH ITEM", item)
                posibilites.push(calculatePosibilities(item))
            })

            return posibilites
        }

        function calculatePosibilities(domain) {
            if (domain.includes(dict.IF) && domain.includes(dict.AFTER)) {
                //TODO
            } else if (domain.includes(dict.IF)) {
                //TODO
            } else if (domain.includes(dict.AFTER)) {
                //TODO
            } else {
                let observation;
                if (domain.includes(dict.CAUSES)) {
                    let cause = domain.split(dict.CAUSES)[0].trim()
                    observation = domain.split(dict.CAUSES)[1].trim()
                    console.log("observation is ", observation)
                } else if (domain.includes(dict.RELEASES)) {
                    let cause = domain.split(dict.RELEASES)[0].trim()
                    observation = domain.split(dict.RELEASES)[1].trim()
                    console.log("observation is ", observation)
                }
                return observation.charAt(0) === '¬' ? observation.substr(0, 2) : observation.charAt(0)
            }
        }



        function checkActionInDD(val) {
            let ddArray = val.split(';')
            let filteredArray = ddArray.filter(domain => domain.includes(dict.INVOKES) || domain.includes(dict.TRIGGERS))
            filteredArray.forEach(item => {
                calculateTime(item)
            })
        }

        function calculateTime(domain) {
            if (domain.includes(dict.IF) && domain.includes(dict.AFTER)) {
                //TODO
            } else if (domain.includes(dict.IF)) {
                //TODO
            } else if (domain.includes(dict.AFTER)) {
                //TODO
            } else {

                let cause = domain.split(dict.INVOKES)[0].trim()
                let consequence = domain.split(dict.INVOKES)[1]
                action_list[parseInt(action_list.indexOf(cause)) + 1] = consequence.trim()

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
        this.props.actions.setTimeline(td)
    }

    render() {
        const {actions, status, search, signIn} = this.props;
        return (
            <div className="main-fragment">
              <div className="main-fragment-content">
              <div className="tooltip-section__main">
                  <span>¬ (not)</span>
                  <span>π (pi)</span>
                  <span>⋀ (and) </span>
                  <span>⋁ (or)</span>
              </div>
              <div className="entry-section__main">
                <div>
                    <label>Domain Description</label>
                    <textarea ref="domainDescription" className="domain-description-input__main" onChange={::this._handleInput} defaultValue="LOAD causes loaded;
SHOOT causes ¬loaded;
SHOOT causes ¬alive if loaded ∧ ¬hidden;
LOAD invokes ESCAPE;
ESCAPE releases hidden." rows={8}/>
                </div>
                <div>
                    <label>Scenario (OBS)</label>
                    <input ref="obs" className="scenario-input__main"  onChange={::this._handleInput} defaultValue="{(alive ∧ ¬loaded ∧ ¬hidden, 0)}"/>
                    <label>Scenario (ACS)</label>
                    <input ref="acs" className="scenario-input__main" defaultValue="{(LOAD,1), (SHOOT,3)}"/>
                </div>
              </div>
                <button onClick={::this._handleDraw}>Draw</button>
                <Timeline/>
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