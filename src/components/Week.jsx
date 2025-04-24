import styled from 'styled-components';
import './style.css';
import Day from './Day.jsx';
import Today from './Today.jsx';

const birthdays = {
    'Apr 1': 'Kris',
    'Mar 16': 'Kate',
    'Mar 24': 'Palm Sunday',
    'Mar 31': 'Easter',
    'Jul 16': 'Mark',
}

let getNotes = function (day) {
    return [birthdays[day.format('MMM D')]];
}

export default function Week({ week, today, index }) {

    let days = [];
    let dayOfWeek = 1;
    for (const day of week) {
        let isToday = day.date() === today.date() && day.month() === today.month() && day.year() === today.year();
        if (isToday) {
            console.log(`This day is today: ${day}`);
            days.push(<div className='today day' day={day} index={dayOfWeek} key={dayOfWeek}>
                <div className='date'>{day.date() == 1 ? day.format('MMM D') : day.format('D')}
                    {getNotes(day).map((note, index) => (
                        <p key={index}>{note}</p>
                    ))}
                </div>
            </div>);
        } else {
            days.push(<Day className='day' day={day} index={dayOfWeek} key={dayOfWeek}></Day>);
        }
        dayOfWeek++;
    }
    return <div className='week'>
        {days.map((day) => (
            day
        ))}
    </div>
}