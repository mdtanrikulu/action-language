const initialState = {
    error: null
}
const setError = (state = initialState, action) => {
    switch (action.type) {
    case 'ERROR':
        return Object.assign({}, state, {
            error: action.payload
        });
    default:
        return state
    }
}

export default setError