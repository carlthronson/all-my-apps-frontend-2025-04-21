import './style.css';
import Week from './Week.jsx';

const getWeek = function (someDay) {
    let sunday = someDay.clone().startOf('week');
    let week = [];
    for (let x = 0; x < 7; x++) {
        let day = sunday.clone().add(x, 'days');
        week.push(day);
    }
    return week;
}

export default function Month({ someMoment, today, index }) {

    let firstDay = someMoment.clone().startOf('month');
    let weeks = [];
    let firstWeek = getWeek(firstDay);
    weeks.push(firstWeek);
    let lastDay = false;

    for (let day = firstDay.clone().add(7, 'days'); !lastDay; day = day.clone().add(7, 'days')) {
        let week = getWeek(day);
        lastDay = week.find(day => day.date() === someMoment.daysInMonth());
        weeks.push(week);
    }

    return <div className='month-container'>
        {weeks.map((week, index) => (
            <Week week={week} today={today} index={index} key={index}></Week>
        ))}
    </div>
}