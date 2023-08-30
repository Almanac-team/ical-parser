import * as fs from 'fs'
import * as path from 'path'
import parse from '../src'


test('parse typical school calendar', () => {
    const filePath = path.join(__dirname, 'testdata', 'jameshuang7980@gmail.com.ics')
    const ical = fs.readFileSync(filePath, {encoding: 'utf-8'})
    parse(ical)
    // console.log(ical)
})

