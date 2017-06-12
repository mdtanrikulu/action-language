import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../Actions'

import Timeline from './Timeline.js'

import logicDict from './LogicDict.js'
import syntaxDict from './SyntaxDict.js'
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
        for (var i = 0; i < logicDict.length; i++) {
            body = body.replace(new RegExp(logicDict[i][0], 'gi'), logicDict[i][1]);
        }
        if (body !== newBody)
            e.target.value = body
    }

    _handleDraw() {
        let observationList = parseOBS(this.refs.obs.value)
        let actionList = parseACS(this.refs.acs.value)

        let plot = timelineHelper(observationList, actionList)
        console.log("plot", plot);

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
                    <input ref="obs" className="scenario-input__main"  onChange={::this._handleInput} defaultValue="{(alive ⋀ ¬loaded ⋀ ¬hidden, 0)}"/>
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