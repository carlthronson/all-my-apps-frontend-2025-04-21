import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Month from './Month';
import Header from './Header';
import moment, { Moment } from 'moment';
import '../app/calendar/style.css';
import { useForecast } from '@/contexts/ForecastContext';

type CalendarProps = {
  initialDate?: Moment;
};

export default function Calendar({ initialDate = moment() }: CalendarProps) {
  const [someDay, setSomeDay] = useState<Moment>(initialDate);
  const {
    startingBalance,
    cash,
    firstNegativeBalance,
    // maxDebt,
    // dailyActivity,
    setStartingBalance,
    setCash,
    // fetchForecast
  } = useForecast();

  const prev = () => {
    setSomeDay(someDay.clone().subtract(1, 'months'));
  };

  const next = () => {
    setSomeDay(someDay.clone().add(1, 'months'));
  };

  return (
    <div className='calendar'>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '75%' }}>
        Starting Balance:
        <input
          type="number"
          value={startingBalance}
          onChange={(e) => setStartingBalance(Number(e.target.value))}
        />
        Daily Cash Flow:
        <input
          type="number"
          value={cash}
          onChange={(e) => setCash(Number(e.target.value))}
        />
        End of runway:
        <input
          type="date"
          value={firstNegativeBalance}
          readOnly={true}
        />
      </div>
      <div className='calendar-container' style={{ width: '95%' }}>
        <Header someMoment={someDay} prev={prev} next={next} />
        <Month someMoment={someDay} today={moment()} />
      </div>
      <div>
        <input
          type="number"
          value={startingBalance}
          onChange={(e) => setStartingBalance(Number(e.target.value))}
        />
        <input
          type="number"
          value={cash}
          onChange={(e) => setCash(Number(e.target.value))}
        />
      </div>
      <span>{firstNegativeBalance}</span>
    </div>
  );
}

