import React, { useState, useEffect } from 'react';
import { useForecast } from '@/contexts/ForecastContext';
import styled from 'styled-components';
import './style.css';
import moment from 'moment';
import DailyActivity from './DailyActivity';

export default function Day({ day, index }) {
    const {
        startingBalance,
        cash,
        firstNegativeBalance,
        maxDebt,
        dailyActivity,
        setStartingBalance,
        setCash,
        fetchForecast
    } = useForecast();

    if (dailyActivity?.length > 0) {
        // debugger;
        // console.log('day', day);
    }

    // Find the activity matching the current day
    const todaysActivity = dailyActivity.find(activity => {
        // console.log('activity', activity);
        return moment(activity.date).isSame(day, 'day')
    });

    let bgcolor = Number(todaysActivity?.endingBalance) < 0.0 ? 'red' : (Number(todaysActivity?.endingBalance) < Number(todaysActivity?.startingBalance) ? 'orange' : 'lightgreen');

    return (
        <div
            className='day'
            style={{
                backgroundColor: todaysActivity?.transactions.length > 1
                    ? bgcolor
                    : undefined
            }}
        >            <div className='date'>{day.date() == 1 ? day.format('MMM D') : day.format('D')}</div>
            {
                todaysActivity?.transactions.length > 1 && (
                    <DailyActivity
                        activity={todaysActivity}
                        key={`${index}-${todaysActivity.date}`}
                        index={index}
                    />
                )
            }
        </div >
    )
}