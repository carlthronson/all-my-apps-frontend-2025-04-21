// utils/auth.ts
import { fetchGraphQL } from "@/utils/fetchGraphQL";

export async function signUp({ email, password }: { email: string; password: string }) {
  const query = `
    mutation SignUp($email: String!, $password: String!) {
      signUp(email: $email, password: $password) {
        id
        email
      }
    }
  `;
  const variables = { email, password };
  return fetchGraphQL({ query, variables });
}
