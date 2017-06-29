class Observation {
    constructor(sign, value) {
        this.sign = sign;
        this.value = value;
    }

    toHR() {
        return this.sign == 0 ? `¬${this.value}` : this.value
    }
}

export default Observation