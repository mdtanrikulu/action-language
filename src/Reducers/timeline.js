const initialState = {
    branches: [],
    timelineData: [],
    observationHistory: []
}
const setTimeline = (state = initialState, action) => {
    switch (action.type) {
    case 'TIMELINE':
        return Object.assign({}, state, {
            timelineData: action.payload
        });
    case 'BRANCH':
        return Object.assign({}, state, {
            branches: [
                ...state.branches,
                action.payload
            ]
        });
    case 'OBSERVATION_HISTORY':
        return Object.assign({}, state, {
            observationHistory: action.payload
        });
    default:
        return state
    }
}

export default setTimeline