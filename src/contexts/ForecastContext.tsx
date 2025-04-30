// contexts/ForecastContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

const query = `
  query getForecast($startBalance: Int!, $cash: Int!) {
    getForecast(
      startBalance: $startBalance
      cash: $cash
    ) {
      startingBalance
      cash
      endingDate
      firstNegativeBalance
      maxDebt
      dailyActivity {
        date
        startingBalance
        transactions {
          id
          name
          amount
          dayOfMonth
        }
        endingBalance
      }
    }  
  }
`

export function ForecastProvider({ children }: { children: React.ReactNode }) {
  const [startingBalance, setStartingBalance] = useState(10000);
  const [cash, setCash] = useState(100);
  const [firstNegativeBalance, setFirstNegativeBalance] = useState("");
  const [maxDebt, setMaxDebt] = useState(0);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);

  const fetchForecast = useCallback(async () => {
    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query, // Move your query here
          variables: { startBalance: startingBalance, cash }
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

