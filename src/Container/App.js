import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import Header from '../Components/Header';
import MainFragment from '../Components/MainFragment';
import Footer from '../Components/Footer';
import NotFound from '../Components/NotFound';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../Actions'

let history = null;
const routes = (
<Route component={ App }>
  <Route path="/" component={ MainFragment } />
  <Route path="*" component={ NotFound } />
</Route>
);

class App extends Component {

    constructor(props) {
        super(props);
        history = syncHistoryWithStore(browserHistory, this.props.store)
    }

    render() {

        const {actions, status, search} = this.props;
        return (
            <div>
              <Header actions={ actions } />
              <Router history={ history }>
                { routes }
              </Router>
              <Footer/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    status: state.firstReducer,
    search: state.setSearch
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)