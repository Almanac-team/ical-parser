enum Frequency {
    Minutely,
    Hourly,
    Daily,
    Weekly,
    Monthly,
    Yearly
}

enum Month {
    January = 1,
    February = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12
}

enum Weekday {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

interface ICalRecurrenceRule {
    frequency?: Frequency,
    until?: Date, // cutoff date
    interval?: Number, // how many times to repeat frequency before next event
    count?: Number, // how many events are planned
    byMonth?: Array<Month>, // months on which event is repeated
    byDay?: Array<[Number, Weekday]>, // 0 => every, 1 means first of x day of week, etc.
    byHour?: Array<Number>, // what hours the event repeats itself
    byMonthDay?: Array<Number>, // which days of the month repeats occur
    byWeekNum?: Array<Number>,
    byYearDay?: Array<Number>,
    byMinute?: Array<Number> // which minutes do events repeat
    bySetPos?: Number // which instance to select from final list
    weekStart?: Weekday // when to start count for weekdays

}

interface ICalEvent {
    start: Date,
    end?: Date,
    description: string,
    created: Date,
    recurrenceRule: ICalRecurrenceRule
}

function parseRecurrenceRule(content: string): ICalRecurrenceRule {
    if (content.length === 0) {
        throw Error("Recurrence rule cannot be empty.")
    }
    const parts = content.split(';').map(part => part.trim())
    return parts.reduce((prev: ICalRecurrenceRule, curr) => {
        const [property, value] = curr.split("=")
        const propertyName = property.trim().toLowerCase()
        switch (propertyName) {
            case "frequency":
                prev["frequency"] = parseFrequency(value);
                break;
            case "count":
            case "interval":
                prev[propertyName] = Number(value);
                break;
            case "until":
                prev["until"] = new Date(value);
                break;
            case "byday":
                const dayStrings = value.split(',')
                if (dayStrings.length === 0) {
                    break;
                }
                prev["byDay"] = dayStrings.map(dayString => {
                    // day strings listed will have a preceding digit in some cases
                    if (isDigit(dayString[0])) {
                        const digit = Number(dayString[0])
                        const weekDay = parseWeekAbbreviation(dayString.substring(1))
                        return [digit, weekDay]
                    } else if (isDigit(dayString[1])) {
                        // account for negative daystring numbers
                        const digit = -Number(dayString[1])
                        const weekDay = parseWeekAbbreviation(dayString.substring(2))
                        return [digit, weekDay]
                    }
                    const weekDay = parseWeekAbbreviation(dayString.substring(1))
                    return [0, weekDay]
                })
                break;
            case "byMinute":
            case "byHour":
            case "bymonthday":
            case "byWeekNum":
            case "byYearDay":
                const nums = value.split(',').map(num => Number(num))
                prev["byMonthDay"] = nums
                break;
            case "bymonth":
                const months = value.split(',').map()
            case "wkst":
                prev["weekStart"] = parseWeekAbbreviation(value);
                break;
            default:
                console.warn(`Property ${propertyName} not recognized or supported.`)
        }
        return prev
    }, {})
}

function parseFrequency(freq: string) {
    switch(freq.toLowerCase()) {
        case "minutely":
            return Frequency.Minutely;
        case "hourly":
            return Frequency.Hourly;
        case "daily":
            return Frequency.Weekly;
        case "monthly":
            return Frequency.Monthly;
        case "yearly":
            return Frequency.Yearly;
        default:
            throw new Error(`Frequency ${freq} not supported.`)
    }
}

function parseWeekAbbreviation(abbreviation: string) {
    switch(abbreviation) {
        case "MO":
            return Weekday.Monday;
        case "TU":
            return Weekday.Tuesday;
        case "WE":
            return Weekday.Wednesday;
        case "TH":
            return Weekday.Thursday;
        case "FR":
            return Weekday.Friday;
        case "SA":
            return Weekday.Saturday;
        case "SU":
            return Weekday.Sunday;
        default:
            throw new Error(`Weekday abbreviation ${abbreviation} not supported.`)
    }
}

function parseMonthAbbreviation(abbreviation: string) {
    switch(abbreviation) {
        
    }
}

function isDigit(character: string) {
    const digitSet = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
    return digitSet.has(character);
}

export {parseRecurrenceRule, parseFrequency, Frequency, Month, Weekday, ICalEvent, ICalRecurrenceRule}