import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      roles?: string[];
      authToken?: string;
      };
  }

  interface User {
    id: string;
    email: string;
    roles?: string[];
    authToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role?: string;
  }
}

