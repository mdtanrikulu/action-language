import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../Actions'

class TimeLine extends React.Component {

    constructor(props) {
        super(props);
    }

    createLine(data, error) {
        return data.map((item, index) => <div className="item__timeline" key={index.toString()}>
            <div className="indicator__timeline">
                <span>{index}</span>
                { item.action && <div className="highliht__timeline"><span>{item.action}</span></div>}
            </div>
            <div className="line__timeline"/>
            <div className="label-container__timeline">
            {item.val.map(({value, sign}, index) => <span key={index.toString()}> {sign ? '' : '¬'}{value.charAt(0)}</span>)}
            </div>
        </div>)
    }

    render() {
        const {data, amount, error} = this.props
        return (
            <div>
                <h4>Case {amount} {error && ': ' + error.message}</h4>
                <div className="container__timeline">
                    {data && this.createLine(data, error)}
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

export default connect(mapStateToProps, mapDispatchToProps)(TimeLine)
