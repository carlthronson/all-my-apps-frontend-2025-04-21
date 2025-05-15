"use client";

import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";

// Define the argument and return types for signUp
interface SignUpArgs {
  email: string;
  password: string;
  name: string;
}

interface SignUpResponse {
  message?: string;
  error?: string;
  id?: string;
  email?: string;
  // Add more fields as needed based on your API response
}

// Only this function changes!
async function signUp({ email, password, name }: SignUpArgs): Promise<SignUpResponse> {
  const query = `
    mutation signup($email: String!, $password: String!, $name: String!) {
      signup(email: $email, password: $password, name: $name) {
        id
        email
      }
    }
  `;

  const response = await fetch(`/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query, // Move your query here
      variables: { email, password, name }
    })
  });

  const json = await response.json();
  if (json?.errors) throw new Error(json.errors[0].message);
  // Adjust this depending on your GraphQL schema
  return json.data.signup;
}

export default function SignupPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await signUp({ email, password, name: email }); // Assuming name is the part before '@'
      // Optionally, sign in the user automatically here
      router.push("/login"); // Or wherever you want to redirect
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto", padding: 20 }}>
      <h1>Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button type="submit" style={{ width: "100%", padding: 10 }}>
        Sign Up
      </button>
    </form>
  );
}
