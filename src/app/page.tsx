// src/app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import AuthButtons from "@components/AuthButtons";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div><AuthButtons></AuthButtons></div>;
  }

  return <div>Welcome {session.user?.email}</div>;
}
