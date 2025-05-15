// contexts/ForecastContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GET_FORECAST } from '@/graphql/queries'; // Adjust the import path as necessary

type DailyActivity = {
  date: string;
  startingBalance: number;
  transactions: {
    name: string;
    amount: number;
    dayOfMonth: number;
  }[];
  endingBalance: number;
};

type ForecastContextType = {
  startingBalance: number;
  cash: number;
  firstNegativeBalance: string;
  maxDebt: number;
  dailyActivity: DailyActivity[];
  setStartingBalance: (value: number) => void;
  setCash: (value: number) => void;
  fetchForecast: () => Promise<void>;
};

const ForecastContext = createContext<ForecastContextType | null>(null);

export function ForecastProvider({
  initialData,
  children,
}: {
  initialData: ForecastContextType;
  children: React.ReactNode;
}) {
  const [startingBalance, setStartingBalance] = useState(initialData.startingBalance);
  const [cash, setCash] = useState(initialData.cash);
  const [firstNegativeBalance, setFirstNegativeBalance] = useState(initialData.firstNegativeBalance);
  const [maxDebt, setMaxDebt] = useState(initialData.maxDebt);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>(initialData.dailyActivity);

  const fetchForecast = useCallback(async () => {
    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_FORECAST, // Move your query here
          variables: { startBalance: Math.trunc(startingBalance), cash }
        })
      });

      const json = await response.json();
      if (json?.errors) throw new Error(json.errors[0].message);

      setFirstNegativeBalance(json.data.getForecast.firstNegativeBalance);
      setMaxDebt(json.data.getForecast.maxDebt);
      setDailyActivity(json.data.getForecast.dailyActivity);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [startingBalance, cash]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return (
    <ForecastContext.Provider value={{
      startingBalance,
      cash,
      firstNegativeBalance,
      maxDebt,
      dailyActivity,
      setStartingBalance,
      setCash,
      fetchForecast
    }}>
      {children}
    </ForecastContext.Provider>
  );
}

export const useForecast = () => {
  const context = useContext(ForecastContext);
  if (!context) throw new Error("useForecast must be used within ForecastProvider");
  return context;
};
