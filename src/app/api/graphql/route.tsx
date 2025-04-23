// src/app/api/graphql/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const getCorsHeaders = (request: NextRequest): Record<string, string> => {
  const allowedOrigins = [
    'https://all-my-apps-frontend-2025-04-21.vercel.app',
    'http://localhost:3000'
  ];

  const origin = request.headers.get('origin') || '';
  const finalOrigin = allowedOrigins.includes(origin) ? origin : '';

  return {
    'Access-Control-Allow-Origin': finalOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };
};

export async function POST(request: NextRequest) {
  console.log("POST request to /api/graphql");
  const headers = getCorsHeaders(request);

  try {
    const body = await request.json();
    const token = await getToken({ req: request });

    const response = await fetch(process.env.API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.API_KEY as string,
        Authorization: `Bearer ${token?.backendJWT}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    return new NextResponse(JSON.stringify(data), { headers });

  } catch (error) {
    console.error("Error in GraphQL proxy:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://all-my-apps-frontend-2025-04-21.vercel.app',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
