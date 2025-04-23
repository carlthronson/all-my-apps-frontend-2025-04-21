import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  email: string;
  roles: string;
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
        const res = await fetch(`http://localhost:3000/api/graphql`, {
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

        // console.log("Response from login:", res);
        const data = await res.json();
        console.log("Data from login:", data);
        // const user: User = await res.json();
        const user: User = data?.data?.login;

        // You can add additional checks here if needed
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
        // token.role = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        // session.user.role = token.role as string | undefined;
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

