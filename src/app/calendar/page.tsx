// 'use client';
import Calendar from '@/components/Calendar';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import { ForecastProvider } from '@/contexts/ForecastContext';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { GET_FORECAST } from '@/graphql/queries';
import Link from "next/link";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch data for CASH
  const cashForecastData = await fetchGraphQL({
    query: GET_FORECAST,
    variables: {
      accountName: "CASH",
      startingBalance: -1,
      dailySpending: 1,
    }
  });
  const cashForecast = cashForecastData?.getForecast;

  // Fetch data for CREDIT (adjust startingBalance and dailySpending as needed)
  const creditForecastData = await fetchGraphQL({
    query: GET_FORECAST,
    variables: {
      accountName: "CREDIT",
      startingBalance: -1, // Example value, adjust as needed
      dailySpending: 100,      // Example value, adjust as needed
    }
  });
  const creditForecast = creditForecastData?.getForecast;

  // Transform the forecast data to match the ForecastContextType
  const initialData = {
    ...cashForecast, // Use CASH as the default for other fields
    accountName: "CASH", // Default to CASH as the selected account
    startingBalance: new Map<string, number>([
      ["CASH", cashForecast.startingBalance],
      ["CREDIT", creditForecast.startingBalance],
    ]),
    dailySpending: new Map<string, number>([
      ["CASH", cashForecast.dailySpending],
      ["CREDIT", creditForecast.dailySpending],
    ]),
    // Other fields can remain as they are from cashForecast, or you can merge them if your backend supports it
    firstNegativeBalance: cashForecast.firstNegativeBalance,
    maxDebt: cashForecast.maxDebt,
    dailyActivity: cashForecast.dailyActivity,
  };

  return (
    <ForecastProvider initialData={initialData}>
      <div>
      <Link href="/">
          Home
        </Link>
      </div>
      <Calendar />
    </ForecastProvider>
  );
}
