"use client";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user && (
        <>
          <p>Email: {session.user.email}</p>
          <p>User ID: {session.user.id}</p>
          
          {/* Roles Display */}
          {session.user.roles && session.user.roles.length > 0 && (
            <p>Roles: {session.user.roles.join(', ')}</p>
          )}
        </>
      )}
    </div>
  );
}

