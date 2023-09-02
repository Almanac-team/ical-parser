const ATTRIBUTE_REGEX = ""


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
    frequency: "minutely"| "hourly" | "daily" | "weekly" | "monthly" | "yearly",
    until?: Date, // cutoff date
    interval?: Number, // how many times to repeat frequency before next event
    count?: Number, // how many events are planned
    byMonth?: Array<Month>, // months on which event is repeated
    byDay?: Array<[Number, Weekday]>, // 0 => every, 1 means first of x day of week, etc.
    byHour?: Array<Number>, // what hours the event repeats itself
    byMonthDay?: Array<Number>, // which days of the month repeats occur
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
    return {
        frequency: 'daily'
    }
}

function parse(content: string): Array<any> {
    let elements = content.split("\n")
    let count =0
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
export {parseRecurrenceRule, ICalEvent, ICalRecurrenceRule}