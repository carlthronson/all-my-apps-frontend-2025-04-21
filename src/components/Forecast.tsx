"use client";
import React from 'react';
import { useState, useEffect } from "react";

type DailyBalance = {
  date: string;
  endingBalance: number;
};

export default function Forecast() {
  // const [transactions, setTasks] = useState([]);
  // const [mode, setMode] = useState('READONLY');
  const [isClient, setIsClient] = useState(false)
  const [startingBalance, setStartingBalance] = useState(10000);
  const [cash, setCash] = useState(100);
  const [endingDate, setEndingDate] = useState("");
  const [firstNegativeBalance, setFirstNegativeBalance] = useState("");
  const [maxDebt, setMaxDebt] = useState(0);
  const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([]);

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
        dailyBalances {
          date
          endingBalance
        }
      }  
    }
  `

  console.log("query: " + query);

  useEffect(() => {
    setIsClient(true) // Only runs on client
    fetch(`/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          startBalance: startingBalance,
          cash: cash,
        }
      })
    })
      .then((response) => {
        const json = response.json();
        console.log("Response from GraphQL:", json);
        return json;
      })
      .then((json) => {
        if (json?.errors) {
          console.error("GraphQL errors:", json.errors);
          return;
        }
        setStartingBalance(json?.data?.getForecast?.startingBalance);
        setCash(json?.data?.getForecast?.cash);
        setEndingDate(json?.data?.getForecast?.endingDate);
        setFirstNegativeBalance(json?.data?.getForecast?.firstNegativeBalance);
        setMaxDebt(json?.data?.getForecast?.maxDebt);
        setDailyBalances(json?.data?.getForecast?.dailyBalances);
      })
      .catch((error) => {
        console.error("Error fetching data from GraphQL response:", error);
      });
    // setMode(status === 'authenticated' ? 'LIVE' : 'READONLY');
  }, []);

  if (!isClient) return null // Server renders nothing

  return (
    <>
    <h1>Forecast</h1>
    // input fields for starting balance and cash
    <input
      type="number"
      value={startingBalance}
      onChange={(e) => setStartingBalance(parseInt(e.target.value))}
      placeholder="Starting Balance"
    />
    <input
      type="number"
      value={cash}
      onChange={(e) => setCash(parseInt(e.target.value))}
      placeholder="Cash"
    />
    <button onClick={() => {
      fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: {
            startBalance: startingBalance,
            cash: cash,
          }
        })
      })
        .then((response) => {
          const json = response.json();
          console.log("Response from GraphQL:", json);
          return json;
        })
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
          setStartingBalance(json?.data?.getForecast?.startingBalance);
          setCash(json?.data?.getForecast?.cash);
          setEndingDate(json?.data?.getForecast?.endingDate);
          setFirstNegativeBalance(json?.data?.getForecast?.firstNegativeBalance);
          setMaxDebt(json?.data?.getForecast?.maxDebt);
          setDailyBalances(json?.data?.getForecast?.dailyBalances);
        })
        .catch((error) => {
          console.error("Error fetching data from GraphQL response:", error);
        });
    }
    }>Get Forecast</button>

    {/* <h2>Starting Balance: {startingBalance}</h2>
    <h2>Cash: {cash}</h2> */}
    {/* <h2>Ending Date: {endingDate}</h2> */}
    <h2>First Negative Balance: {new Date(firstNegativeBalance).toLocaleDateString()}</h2>
    <h2>Max Debt: {maxDebt}</h2>
    {/* {dailyBalances.map((balance, index) => (
      <div key={index}>
        <h2>Date: {balance.date}</h2>
        <h2>Ending Balance: {balance.endingBalance}</h2>
      </div>
    ))} */}
    </>
  );
}
