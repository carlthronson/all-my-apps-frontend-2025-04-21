// 'use client';
import Calendar from '@/components/Calendar';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import { ForecastProvider } from '@/contexts/ForecastContext';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { GET_FORECAST } from '@/graphql/queries';

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const forecastData = await fetchGraphQL({
    query: GET_FORECAST, variables: {
      accountName: "CASH",
      startingBalance: 3716,
      dailySpending: 1,
    }
  });
  const forecast = forecastData?.getForecast;

  return (
    <ForecastProvider initialData={forecast}>
      <Calendar />;
    </ForecastProvider>
  );
}

