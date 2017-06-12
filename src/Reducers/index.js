import { combineReducers } from 'redux'
import asyncLoad from './asyncLoad'
import timeline from './timeline'
import error from './error'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
    asyncLoad,
    timeline,
    error,
    routing: routerReducer
})

export default reducer