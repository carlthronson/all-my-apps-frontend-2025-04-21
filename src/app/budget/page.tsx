"use client"
// import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import ExampleTable from "@components/ExampleTable";

export default function Budget() {
  const { status } = useSession()
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login");
  }

  return (
    <div>
      <h1>Budget</h1>
      <h2>Transactiona</h2>
      <ExampleTable></ExampleTable>
    </div>
  );
}

