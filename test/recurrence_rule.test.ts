import { parseRecurrenceRule, Frequency, ICalRecurrenceRule, Month, Weekday } from "../src/lib/rrule";

test.each([
    {
        input: "FREQ=DAILY;COUNT=10",
        expected: {
            frequency: Frequency.Daily,
            count: 10
        },
        msg: 'basic count 10 of event'
    },
    {
        input: "FREQ=DAILY;UNTIL=19971224T000000Z",
        expected: {
            frequency: Frequency.Daily,
            until: new Date(1997, 12, 24)
        },
        msg: 'daily with enddate'
    },
    {
        input: "FREQ=DAILY;INTERVAL=2",
        expected: {
            frequency: Frequency.Daily,
            interval: 2
        }, 
        msg: 'parse basic case of infinite event'
    },
    {
        input: "FREQ=DAILY;INTERVAL=10;COUNT=5",
        expected: {
            frequency: Frequency.Daily,
            interval: 10,
            count: 5
        },
        msg: 'combination of interval with count'
    },
    {
        input: "FREQ=YEARLY;UNTIL=20000131T140000Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA",
        expected: {
            frequency: Frequency.Yearly,
            until: new Date(2000, 1, 31),
            byMonth: [Month.January],
            byDay: [
                [0, Weekday.Sunday],
                [0, Weekday.Monday],
                [0, Weekday.Tuesday],
                [0, Weekday.Wednesday],
                [0, Weekday.Thursday],
                [0, Weekday.Friday],
                [0, Weekday.Saturday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'bymonth combined with weekday names',
    },
    {
        input: "FREQ=DAILY;UNTIL=20000131T140000Z;BYMONTH=1",
        expected: {
            frequency: Frequency.Daily,
            until: new Date(2000, 1, 31),
            byMonth: [Month.January]
        },
        msg: 'bymonth combined with daily frequency'
    },
    {
        input: 'FREQ=WEEKLY;COUNT=10',
        expected: {
            frequency: Frequency.Weekly,
            count: 10
        },
        msg: 'weekly count of 10'
    },
    {
        input: "FREQ=WEEKLY;UNTIL=19971224T000000Z",
        expected: {
            frequency: Frequency.Weekly,
            until: new Date(1997, 12, 24)
        },
        msg: 'weekly frequency with end date'
    },
    {
        input: "FREQ=WEEKLY;INTERVAL=2;WKST=SU",
        expected: {
            frequency: Frequency.Weekly,
            interval: 2,
            weekStart: Weekday.Sunday
        },
        msg: 'every other week forever'
    },
    {
        input: "FREQ=WEEKLY;UNTIL=19971007T000000Z;WKST=SU;BYDAY=TU,TH",
        expected: {
            frequency: Frequency.Weekly,
            until: new Date(1997, 10, 7),
            weekStart: Weekday.Sunday,
            byDay: [
                [0, Weekday.Tuesday], 
                [0, Weekday.Thursday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'particular days of week with end date'
    },
    {
        input: "FREQ=WEEKLY;INTERVAL=2;UNTIL=19971224T000000Z;WKST=SU;BYDAY=MO,WE,FR",
        expected: {
            frequency: Frequency.Weekly,
            interval: 2,
            until: new Date(1997, 12, 24),
            weekStart: Weekday.Sunday,
            byDay: [
                [0, Weekday.Monday], 
                [0, Weekday.Wednesday], 
                [0, Weekday.Friday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'alternating weeks with end date'
    },
    {
        input: "FREQ=WEEKLY;INTERVAL=2;COUNT=8;WKST=SU;BYDAY=TU,TH",
        expected: {
            frequency: Frequency.Weekly,
            interval: 2,
            count: 8,
            weekStart: Weekday.Sunday,
            byDay: [
                [0, Weekday.Tuesday],
                [0, Weekday.Thursday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'alternating weeks with set count'
    },
    {
        input: "FREQ=MONTHLY;COUNT=10;BYDAY=1FR",
        expected: {
            frequency: Frequency.Monthly,
            count: 10,
            byDay: [
                [1, Weekday.Friday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'montly frequency with numbered day of week'
    },
    {
        input: "FREQ=MONTHLY;UNTIL=19971224T000000Z;BYDAY=1FR",
        expected: {
            frequency: Frequency.Monthly,
            until: new Date(1997, 12, 24),
            byDay: [
                [0, Weekday.Friday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'numbered day of week with end date'
    },
    {
        input: "FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU",
        expected: {
            frequency: Frequency.Monthly,
            interval: 2,
            count: 10,
            byDay: [
                [1, Weekday.Sunday],
                [-1, Weekday.Sunday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'duplicate day of week with differing numbers'
    },
    {
        input: "FREQ=MONTHLY;COUNT=6;BYDAY=-2MO",
        expected: {
            frequency: Frequency.Monthly,
            count: 6,
            byDay: [
                [-2, Weekday.Monday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'monthly frequency with negative numbered day of week'
    },
    {
        input: "FREQ=MONTHLY;BYMONTHDAY=-3",
        expected: {
            frequency: Frequency.Monthly,
            byMonthDay: [-3]
        },
        msg: 'basic case of bymonthday is parsed'
    },
    {
        input: "FREQ=MONTHLY;COUNT=10;BYMONTHDAY=2,15",
        expected: {
            frequency: Frequency.Monthly,
            count: 10,
            byMonthDay: [2, 15]
        },
        msg: 'multiple month days with set count'
    },
    {
        input: "FREQ=MONTHLY;COUNT=10;BYMONTHDAY=1,-1",
        expected: {
            frequency: Frequency.Monthly,
            count: 10,
            byMonthDay: [1, -1]
        },
        msg: 'combiantion of + and - month days'
    },
    {
        input: "FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15",
        expected: {
            frequency: Frequency.Monthly,
            interval: 18,
            count: 10,
            byMonthDay: [10, 11, 12, 13, 14, 15]
        },
        msg: 'month days with interval'
    },
    {
        input: "FREQ=MONTHLY;INTERVAL=2;BYDAY=TU",
        expected: {
            frequency: Frequency.Monthly,
            interval: 2,
            byDay: [
                [0, Weekday.Tuesday]
            ] as Array<[Number, Weekday]>   
        },
        msg: 'monthly occurence on particular day of week'
    },
    {
        input: "FREQ=YEARLY;COUNT=10;BYMONTH=6,7", // time from processing should be dstart
        expected: {
            frequency: Frequency.Yearly,
            count: 10,
            byMonth: [
                Month.June,
                Month.July
            ]
        },
        msg: 'yearly frequency every month'
    },
    {
        input: "FREQ=YEARLY;INTERVAL=2;COUNT=10;BYMONTH=1,2,3",
        expected: {
            frequency: Frequency.Yearly,
            interval: 2,
            count: 10,
            byMonth: [
                Month.January,
                Month.February,
                Month.March
            ]
        },
        msg: 'bymonth with interval'
    },
    {
        input: "FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200",
        expected: {
            frequency: Frequency.Yearly,
            interval: 3,
            count: 10,
            byYearDay: [1, 100, 200]
        },
        msg: 'year days parsed'
    },
    {
        input: "FREQ=YEARLY;BYDAY=20MO",
        expected: {
            frequency: Frequency.Yearly,
            byDay: [
                [20, Weekday.Monday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'numbered day of week in particular year'
    },
    {
        input: "FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO",
        expected: {
            frequency: Frequency.Yearly,
            byWeekNum: [20],
            byDay: [
                [0, Weekday.Monday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'alternate way of writing 20th mondays with weeknum'
    },
    {
        input: "FREQ=YEARLY;BYMONTH=3;BYDAY=TH",
        expected: {
            frequency: Frequency.Yearly,
            byMonth: [Month.March],
            byDay: [
                [0, Weekday.Thursday]
            ] as Array<[Number, Weekday]>
        },
        msg: 'bymonth combined with byday'
    },
    {
        input: "FREQ=YEARLY;BYDAY=TH;BYMONTH=6,7,8",
        expected: {
            frequency: Frequency.Yearly,
            byDay: [
                [0, Weekday.Thursday]
            ] as Array<[0, Weekday]>,
            byMonth: [
                Month.June,
                Month.July,
                Month.August
            ]
        },
        msg: 'single day of week with multiple months'
    },
    {
        input: "FREQ=MONTHLY;BYDAY=FR;BYMONTHDAY=13",
        expected: {
            frequency: Frequency.Yearly,
            byDay: [
                [0, Weekday.Friday]
            ] as Array<[0, Weekday.Friday]>,
            byMonthDay: [13]
        },
        msg: 'every friday the 13th'
    },
    {
        input: "FREQ=MONTHLY;BYDAY=SA;BYMONTHDAY=7,8,9,10,11,12,13",
        expected: {
            frequency: Frequency.Monthly,
            byDay: [
                [0, Weekday.Saturday]
            ] as Array<[Number, Weekday]>,
            byMonthDay: [7, 8, 9, 10, 11, 12, 13]
        },
        msg: 'first saturday following the first sunday of a month'
    },
    {
        input: "FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8",
        expected: {
            frequency: Frequency.Yearly,
            interval: 4,
            byMonth: [Month.November],
            byDay: [
                [0, Weekday.Tuesday]
            ] as Array<[Number, Weekday]>,
            byMonthDay: [2, 3, 4, 5, 6, 7, 8]
        },
        msg: 'us presidential election day'
    },
    {
        input: "FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3",
        expected: {
            frequency: Frequency.Monthly,
            count: 3,
            byDay: [
                [0, Weekday.Tuesday],
                [0, Weekday.Wednesday],
                [0, Weekday.Thursday]
            ] as Array<[Number, Weekday]>,
            bySetPos: 3
        },
        msg: 'bysetpos parsed'
    },
    {
        input: "FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2",
        expected: {
            frequency: Frequency.Monthly,
            byDay: [
                [0, Weekday.Monday],
                [0, Weekday.Tuesday],
                [0, Weekday.Wednesday],
                [0, Weekday.Thursday],
                [0, Weekday.Friday]
            ] as Array<[Number, Weekday]>,
            bySetPos: -2
        },
        msg: 'negative setpos'
    },
    {
        input: "FREQ=HOURLY;INTERVAL=3;UNTIL=19970902T170000Z",
        expected: {
            frequency: Frequency.Hourly,
            interval: 3,
            until: new Date(1997, 9, 2)
        },
        msg: 'hourly frequency'
    },
    {
        input: "FREQ=MINUTELY;INTERVAL=15;COUNT=6",
        expected: {
            frequency: Frequency.Minutely,
            interval: 15,
            count: 6
        },
        msg: "minutely frequency"
    },
    {
        input: "FREQ=MINUTELY;INTERVAL=90;COUNT=4",
        expected: {
            frequency: Frequency.Minutely,
            interval: 90,
            count: 4
        },
        msg: "minutely frequency with > hour interval"
    },
    {
        input: "FREQ=DAILY;BYHOUR=9,10,11,12,13,14,15,16;BYMINUTE=0,20,40",
        expected: {
            frequency: Frequency.Daily,
            byHour: [9, 10, 11, 12, 13, 14, 15, 16],
            byMinute: [0, 20, 40]
        },
        msg: "parse by minute"
    }
])('$msg', ({input, expected}: {input: string, expected: ICalRecurrenceRule}) => {
    const result = parseRecurrenceRule(input)
    expect(result).toBe(expected)
})