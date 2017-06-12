export const asyncLoad = () => {
    return {
        type: 'ASYNC_LOAD'
    }
}

export const setTimeline = (payload) => {
    return {
        type: 'TIMELINE',
        payload
    }
}

export const setBranch = (payload) => {
    return {
        type: 'BRANCH',
        payload
    }
}

export const setError = (payload) => {
    return {
        type: 'ERROR',
        payload
    }
}

export const setObservationHistory = (payload) => {
    return {
        type: 'OBSERVATION_HISTORY',
        payload
    }
}