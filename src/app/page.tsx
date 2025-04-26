// src/app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import Link from "next/link";
import AuthButtons from "@components/AuthButtons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log("Session on home page:", session);
  return (
    <main style={{ padding: 20 }}>
      <h1>Home</h1>
      <div>
      <Link href="/job-board">
          Job search app
        </Link>
      </div>
      <div>
      <Link href="/settings">
          Settings
        </Link>
      </div>
      <div>
      <Link href="/budget">
          Budget
        </Link>
      </div>
      <AuthButtons></AuthButtons>
    </main>
  );
}
