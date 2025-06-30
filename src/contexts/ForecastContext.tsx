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
  accountName?: string;
};

type ForecastContextType = {
  accountName: string;
  startingBalance: Map<string, number>;
  dailySpending: Map<string, number>;
  firstNegativeBalance: string;
  maxDebt: number;
  dailyActivity: DailyActivity[];
  setAccountName: (value: string) => void;
  setStartingBalance: (key: string, value: number) => void;
  setDailySpending: (key: string, value: number) => void;
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
  const [accountName, setAccountName] = useState(initialData.accountName);
  const [startingBalance, internalSetStartingBalance] = useState<Map<string, number>>(initialData.startingBalance);
  const [dailySpending, internalSetDailySpending] = useState<Map<string, number>>(initialData.dailySpending);
  const [firstNegativeBalance, setFirstNegativeBalance] = useState(initialData.firstNegativeBalance);
  const [maxDebt, setMaxDebt] = useState(initialData.maxDebt);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>(initialData.dailyActivity);

  const setStartingBalance = useCallback((key: string, value: number) => {
    internalSetStartingBalance(prev => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const setDailySpending = useCallback((key: string, value: number) => {
    internalSetDailySpending(prev => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const fetchForecast = useCallback(async () => {
    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_FORECAST, // Move your query here
          variables: { accountName, startingBalance: Math.trunc(startingBalance.get(accountName) || 0), dailySpending: dailySpending.get(accountName) || 0}
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
  }, [accountName, startingBalance, dailySpending]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return (
    <ForecastContext.Provider value={{
      accountName,
      startingBalance,
      dailySpending,
      firstNegativeBalance,
      maxDebt,
      dailyActivity,
      setAccountName,
      setStartingBalance,
      setDailySpending,
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
