const initialState = {
    timelineData: null
}
const setTimeline = (state = initialState, action) => {
    switch (action.type) {
    case 'TIMELINE':
        return Object.assign({}, state, {
            timelineData: action.payload
        });
    default:
        return state
    }
}

export default setTimeline