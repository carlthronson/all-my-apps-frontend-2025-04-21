// components/Forecast.tsx
"use client";
import { useForecast } from '@/contexts/ForecastContext';
import DailyActivity from './DailyActivity';

export default function Forecast() {
  const {
    startingBalance,
    cash,
    firstNegativeBalance,
    maxDebt,
    dailyActivity,
    setStartingBalance,
    setCash,
    // fetchForecast
  } = useForecast();

  return (
    <>
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
      {/* <button onClick={fetchForecast}>Get Forecast</button> */}
      
      <h3>First Negative Balance: {firstNegativeBalance}</h3>
      <h3>Max Debt: {maxDebt}</h3>
      <h3>Daily Balances:</h3>
      {dailyActivity.map((activity, index) => (
        activity.transactions.length <= 1 ? null :
          <DailyActivity activity={activity} key={index} index={index}/>
      ))}
    </>
  );
}
