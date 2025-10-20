import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import ExampleTable from "@components/ExampleTable";

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Budget</h1>
      <h2>Transactions</h2>
      <ExampleTable />
    </div>
  );
}
