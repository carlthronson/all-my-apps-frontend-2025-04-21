import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import AuthButtons from "@components/AuthButtons";
import UserInfo from "@components/UserInfo";

export default async function Settings() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  console.log("Session in settings:", session);
  return (
    <main style={{ padding: 20 }}>
      <h1>Settings</h1>
      <UserInfo></UserInfo>
      <AuthButtons></AuthButtons>
    </main>
  );
}

