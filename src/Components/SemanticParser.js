function parseSemantic(dd) {
    let regExp = /(^([A-Z]+)|^([a-z].+?(?= triggers))) (\w+) (.+?((?= if)|(?= after)|(?=;)))( after (.+?((?= if)|(?=;))))?( if (.+?((?=;))))?/gm
    let matches;
    let result = []
    while (matches = regExp.exec(dd)) {
        result.push({
            cause: matches[1],
            statement: matches[4],
            fluent: matches[5],
            step: matches[8],
            condition: matches[11]
        })
    }
    return result
}

export default parseSemantic