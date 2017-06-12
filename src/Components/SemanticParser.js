function parseSemantic(dd) {
    let tempArray = []
    let filteredDD = dd.filter(item => item.includes(dict.INVOKES) || item.includes(dict.TRIGGERS))
    filteredDD.map(domain => {

        let cause = null;
        let consequence = null;
        let condition = null;
        let step = 0;

        if (domain.includes(dict.INVOKES)) {

            let parsedDomain = domain.split(dict.INVOKES)
            cause = parsedDomain[0].trim()
            let rest = parsedDomain[1].trim()

            if (rest.includes(dict.IF) && rest.includes(dict.AFTER)) {

                let parsedFluent = rest.split(dict.AFTER)
                consequence = parsedFluent[0].trim()
                let parsedCondition = parsedFluent[1].trim()
                parsedCondition = parsedCondition.split(dict.IF)
                step = parseInt(parsedCondition[0].trim())
                condition = parsedCondition[1].trim()

            } else if (rest.includes(dict.IF)) {

                let parsedFluent = rest.split(dict.IF)
                consequence = parsedFluent[0].trim()
                condition = parsedFluent[1].trim()

            } else if (rest.includes(dict.AFTER)) {

                let parsedFluent = rest.split(dict.AFTER)
                consequence = parsedFluent[0].trim()
                step = parseInt(parsedFluent[1].trim())

            } else {
                consequence = rest.trim()
            }
        } else if (domain.includes(dict.TRIGGERS)) {

            let parsedDomain = domain.split(dict.TRIGGERS)
            cause = parsedDomain[0].trim()
            let rest = parsedDomain[1].trim()
            consequence = rest

        }

        tempArray.push({
            cause,
            consequence,
            step,
            condition
        })
    })
    return tempArray
}

export default parseSemantic