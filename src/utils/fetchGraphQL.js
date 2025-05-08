// utils/fetchGraphQL.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

export async function fetchGraphQL({ query, variables = {} }) {
  // Get the session and extract the backend JWT
  const session = await getServerSession(authOptions);
  const backendJWT = session?.user?.authToken || null;

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.API_KEY,
  };
  if (backendJWT) {
    headers["Authorization"] = `Bearer ${backendJWT}`;
  }

  // Call the backend GraphQL endpoint directly
  const response = await fetch(process.env.API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0].message}`);
  }
  return json.data;
}
