import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import AuthButtons from "@components/AuthButtons";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  console.log("Session in dashboard:", session);
  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      {session.user.role && <p>Role: {session.user.role}</p>}
      <AuthButtons></AuthButtons>
    </main>
  );
}

