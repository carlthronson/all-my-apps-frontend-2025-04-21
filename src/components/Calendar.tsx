// Calendar.tsx
'use client';

import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Month from './Month';
import Header from './Header';
import moment, { Moment } from 'moment';
import '../app/calendar/style.css';
import { useForecast } from '@/contexts/ForecastContext';
import { MenuItem, Select } from '@mui/material';
import { downloadTransactionsCsv } from '@/lib/exportTransactionsCsv';

type CalendarProps = {
  initialDate?: Moment;
};

type CsvRow = {
  date: string;
  description: string;
  amount: number | string;
};

type DailyActivity = {
  date: string;
  startingBalance: number;
  transactions: {
    name: string;
    amount: number;
    dayOfMonth: number;
  }[];
  endingBalance: number;
  accountName?: string;
};

const accountOptions = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CREDIT', label: 'Credit' },
];

export default function Calendar({ initialDate = moment() }: CalendarProps) {
  const [someDay, setSomeDay] = useState<Moment>(initialDate);
  const {
    accountName,
    startingBalance,
    dailySpending,
    firstNegativeBalance,
    dailyActivity,
    setAccountName,
    setStartingBalance,
    setDailySpending,
    // fetchForecast,
  } = useForecast();

  const prev = () => {
    setSomeDay(someDay.clone().subtract(1, 'months'));
  };

  const next = () => {
    setSomeDay(someDay.clone().add(1, 'months'));
  };

  const handleExport = () => {
    const rows = dailyActivity.map((day: DailyActivity): CsvRow[] =>
      day.transactions.map((tx) => ({
        date: day.date,
        description: tx.name,
        amount: tx.amount,
      }))
    ).flat();

    downloadTransactionsCsv(rows, "forecast-transactions.csv");
  };

  return (
    <div className='calendar'>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '75%' }}>
        Account Name:
        <Select
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          displayEmpty
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="" disabled>Select Account</MenuItem>
          {accountOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        Starting Balance:
        <input
          type="number"
          value={startingBalance.get(accountName) || 0}
          onChange={(e) => setStartingBalance(accountName, Number(e.target.value))}
        />
        Daily Spending:
        <input
          type="number"
          value={dailySpending.get(accountName) || 0}
          onChange={(e) => setDailySpending(accountName, Number(e.target.value))}
        />
        End of runway:
        <input
          type="date"
          value={firstNegativeBalance !== null ? firstNegativeBalance : 'N/A'}
          readOnly={true}
        />

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ml-4"
        >
          Export CSV
        </button>
      </div>

      <div className='calendar-container' style={{ width: '95%' }}>
        <Header someMoment={someDay} prev={prev} next={next} />
        <Month someMoment={someDay} today={moment()} />
      </div>
    </div>
  );
}
