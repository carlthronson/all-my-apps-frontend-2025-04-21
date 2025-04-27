import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import Forecast from "@components/Forecast";

export default async function ForecastPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Budget</h1>
      <h2>Forecast</h2>
      <Forecast />
    </div>
  );
}
