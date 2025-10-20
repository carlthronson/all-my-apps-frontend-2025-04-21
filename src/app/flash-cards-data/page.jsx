// /src/app/flash-cards-data/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import FlashCardForm from '@/components/FlashCardForm';
import Link from 'next/link';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <div>
      <Link href="/">
          Home
        </Link>
      </div>
      <FlashCardForm />
    </div>
  );
}
