class TimePoint {
    constructor() {
        this.action;
        this.observation;
    }

    setAction(action) {
        this.action = action
    }

    getAction() {
        return this.action
    }

    setObservartion(observation) {
        this.observation = observation
    }

    getObservation() {
        return this.observation
    }
}

export default TimePoint