import { combineReducers } from 'redux'
import asyncLoad from './asyncLoad'
import timeline from './timeline'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
    asyncLoad,
    timeline,
    routing: routerReducer
})

export default reducer