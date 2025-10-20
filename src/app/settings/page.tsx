import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import AuthButtons from "@components/AuthButtons";
import UserInfo from "@components/UserInfo";
import Link from "next/link";

export default async function Settings() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  console.log("Session in settings:", session);
  return (
    <main style={{ padding: 20 }}>
      <div>
      <Link href="/">
          Home
        </Link>
      </div>
      <h1>Settings</h1>
      <UserInfo></UserInfo>
      <AuthButtons></AuthButtons>
    </main>
  );
}

