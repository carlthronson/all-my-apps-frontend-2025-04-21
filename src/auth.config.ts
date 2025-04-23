import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  email: string;
  roles: string[];
  authToken?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const query = `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              id
              email
              roles
              authToken
            }
          }
        `;
        const res = await fetch(`${process.env.API_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            variables: {
              email: credentials?.email,
              password: credentials?.password
            }
          })
        });

        if (!res.ok) return null;

        const data = await res.json();
        console.log("Data from login:", data);
        const user: User = data?.data?.login;

        if (user?.id) {
          console.log("User authenticated successfully:", user);
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.roles = user.roles;  // Array preserved here
        token.backendJWT = user.authToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.roles = token.roles as string[];  // Fixed array typing
        session.user.authToken = token.backendJWT as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
