"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <>
        <p>Welcome, {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  
  return (
    <>
      <p>Welcome</p>
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => router.push("/signup")}>Sign Up</button>
    </>
  );
}
