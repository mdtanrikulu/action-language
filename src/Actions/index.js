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