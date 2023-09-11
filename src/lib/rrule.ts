import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

enum Frequency {
    Minutely = "minutely",
    Hourly = "hourly",
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
    Yearly = "yearly"
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
            case "freq":
                prev["frequency"] = parseFrequency(value);
                break;
            case "count":
            case "interval":
                prev[propertyName] = Number(value);
                break;
            case "until":
                prev["until"] = parseIcalDate(value)
                break;
            case "byday":
                const dayStrings = value.split(',')
                if (dayStrings.length === 0) {
                    break;
                }

                const digitStringMatch = new RegExp("^-?[0-9]+(.*)$");
                prev["byDay"] = dayStrings.map(dayString => {
                    // day strings listed will have a preceding digit in some cases
                    const numCheck = dayString.match(digitStringMatch)
                    if (numCheck) {
                        // match at 2nd capture group
                        const weekDayAbbr = numCheck[1]
                        const weekDay = parseWeekAbbreviation(weekDayAbbr)
                        const digit = Number(dayString.substring(0, dayString.length - weekDayAbbr.length))
                        return [digit, weekDay]
                    }
                    const weekDay = parseWeekAbbreviation(dayString)
                    return [0, weekDay]
                })
                break;
            case "byminute":
                const minutes = value.split(',').map(num => Number(num))
                prev["byMinute"] = minutes
                break;
            case "byhour":
                const hours = value.split(',').map(num => Number(num))
                prev["byHour"] = hours
                break;
            case "bymonthday":
                const monthDays = value.split(',').map(num => Number(num))
                prev["byMonthDay"] = monthDays
                break;
            case "byweekno":
                const weekNums = value.split(',').map(num => Number(num))
                prev["byWeekNum"] = weekNums
                break;
            case "bymonth":
                const months = value.split(',').map(num => Number(num))
                prev["byMonth"] = months
                break;
            case "byyearday":
                const yearDays = value.split(',').map(num => Number(num))
                prev["byYearDay"] = yearDays
                break;
            case "wkst":
                prev["weekStart"] = parseWeekAbbreviation(value);
                break;
            case "bysetpos":
                prev["bySetPos"] = Number(value)
                break;
            default:
                console.warn(`Property ${propertyName} not recognized or supported.`)
        }
        return prev
    }, {})
}

function parseFrequency(frequency: string) {
    const freq = frequency.toLowerCase()
    switch(freq) {
        case "minutely":
            return Frequency.Minutely;
        case "hourly":
            return Frequency.Hourly;
        case "daily":
            return Frequency.Daily;
        case "weekly":
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

function parseIcalDate(dateString: string) {
    const dayjsDate = dayjs(dateString, "YYYYMMDD HHMMSSZ")
    return dayjsDate.toDate()
}

export {parseRecurrenceRule, parseFrequency, Frequency, Month, Weekday, ICalEvent, ICalRecurrenceRule}