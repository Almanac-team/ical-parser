const ATTRIBUTE_REGEX = ""


function parse(content: string): Array<any> {
    let elements = content.split("\n")
    let count = 0
    const parsed = elements.reduce((prev, line) => {
        switch(line.trim()) {
            case "BEGIN:VEVENT":
                console.log("BEGINNING NEW EVENT")
                break
            case "END:VEVENT":
                console.log("Ending event")
                count += 1
                break
            default:
                console.log(line)
        }
        console.log("line", line)
        return prev
    }, {
        activities: [],
        currentElem: "",
        currentEvent: {}
    })
    

    return []
}

export default parse
