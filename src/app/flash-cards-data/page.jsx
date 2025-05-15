// /src/app/flash-cards-data/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import FlashCardForm from '@/components/FlashCardForm';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <FlashCardForm />
    </div>
  );
}
