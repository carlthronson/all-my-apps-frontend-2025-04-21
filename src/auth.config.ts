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

        try {
          const res = await fetch(`${process.env.API_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query,
              variables: {
                email: credentials.email,
                password: credentials.password
              }
            })
          });

          if (!res.ok) return null;

          const data = await res.json();
          const user: User = data?.data?.login;
          return user?.id ? user : null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.roles = user.roles;
        token.backendJWT = user.authToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.roles = token.roles as string[];
        session.user.authToken = token.backendJWT as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.csrf-token' : '__next-auth.csrf-token',
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      }
    },
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : '__next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      }
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
