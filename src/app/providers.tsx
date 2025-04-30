"use client";

import { SessionProvider } from "next-auth/react";
import { ForecastProvider } from '@/contexts/ForecastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ForecastProvider>
        {children}
      </ForecastProvider>
    </SessionProvider>
  );
}
