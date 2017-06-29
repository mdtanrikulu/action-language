import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../Actions'

import Timeline from './Timeline.js'

import dict from './Dictionary.js'
import parseSemantic from './SemanticParser.js'
import parseOBS from './OBSParser.js'
import parseACS from './ACSParser.js'
import checkCondition from './ConditionChecker.js'
import timelineHelper from './TimelineHelper.js'

class MainFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            error: []
        }
    }

    _handleInput(e) {
        console.log(e.target.value)
        let body = e.target.value
        let newBody = body;
        for (var i = 0; i < dict.logicalSymbols.length; i++) {
            body = body.replace(new RegExp(dict.logicalSymbols[i][0], 'gi'), dict.logicalSymbols[i][1]);
        }
        if (body !== newBody)
            e.target.value = body
    }

    _handleDraw() {
        let branches = []
        let observationList = parseOBS(this.refs.obs.value)
        let actionList = parseACS(this.refs.acs.value)
        let domainDescription = parseSemantic(this.refs.domainDescription.value)

        if(observationList.length > 0){
            console.log("observationList main", observationList);
                branches = timelineHelper(observationList, actionList, domainDescription)
        } else {
                branches = timelineHelper([], actionList, domainDescription)
        }
        this.setState({
            branches
         })
    }

    _handleQuery(){
        let regexpQuery =  /^([a-z]+) (.+?((?= at| after)))?( at ([0-9]+))?( (after? )([A-Z]+|[0-9]+))?( (when? )([0-9]+))?/g
        let query = this.refs.query.value;
        let result = this.refs.result

        let importance = {
            necessary: 1,
            possibly: 0
        }

        let matches;
        while (matches = regexpQuery.exec(query)) {
        query = {
            importance: matches[1],
            formula: matches[2],
            time: matches[5] || "0",
            after: matches[8] || "0",
            when: matches[11]
        }
    }

    if(!query.when){
        let branches = this.state.branches;

        let step;
        let num = query.after
        if(num.match(/^\d+$/)){
            step = num;
        }else if(num.match(/^\d+\.\d+$/)){
            //valid float
        }else{
            console.log("num", num);
            step = _.findIndex(branches, 
                function(timeline) {
                    return _.findIndex(timeline.actionList,function(action) { 
                        console.log("action", action)
                        return action.name = num
                    })
                })
        }

        console.log("step",step);
        
        let index = parseInt(query.time) + parseInt(step)
        console.log("1.query.when", index);
        console.log("2.branches.length", branches[0].time);

        if(index >= branches[0].time){
            index = branches[0].time - 1
        }

        console.log("3.index", index);
        console.log(branches)
        if(query.importance == "necessary"){
            console.log(query)
            result.value = branches.every( (timeline) => {
                return checkCondition( query.formula ,timeline.timePoints[index].observation)
            })
        } else {
            result.value = branches.some( timeline => {
                return checkCondition( query.formula ,timeline.timePoints[index].observation)
            })
        }

    } else {
        const {branches} = this.state

console.log("query.when", query.when);
console.log("branches.length", branches.length);

        if(query.when >= branches[0].time){
            query.when = branches[0].time - 1
        }
        let timeline = branches[query.when];
        let indexq = parseInt(query.time) + parseInt(query.after)
        if(query.importance == "necessary"){
            result.value = timeline.timePoints.every( (timePoint, index) => {
                return indexq > index && checkCondition( query.formula , timePoint.observation)
            })
        } else {
            result.value = timeline.timePoints.some( (timePoint, index) => {
                return indexq > index && checkCondition( query.formula , timePoint.observation)
            })
        }
    }
        
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
                    <textarea ref="domainDescription" className="domain-description-input__main" onChange={::this._handleInput} defaultValue="LOAD releases p;" rows={8}/>
                </div>
                <div>
                    <label>Scenario (OBS)</label>
                    <input ref="obs" className="scenario-input__main"  onChange={::this._handleInput} defaultValue="{(p ⋀ q,0)}"/>
                    <label>Scenario (ACS)</label>
                    <input ref="acs" className="scenario-input__main" defaultValue="{(LOAD,1)}"/>
                    <br/><br/><br/>
                    <label>Query</label>
                    <input ref="query" onChange={::this._handleInput} className="scenario-input__main"/>
                    <button onClick={::this._handleQuery}>Draw</button>
                    <input ref="result" className="scenario-input__main"/>
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