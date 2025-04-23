import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  console.log("POST request to /api/graphql");
  console.log("Request headers:", request.headers.get("cookie"));
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(process.env.API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.API_KEY as string,
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    const nextResponse = NextResponse.json(data);

    console.log("Response data:", data);

    const authToken = data?.data?.login?.authToken ||
      data?.data?.VerifyAuthToken.authToken;

    // Handle token from response body instead of headers
    if (authToken) {
      console.log("Setting auth token in cookies");
      const cookieStore = await cookies();

      cookieStore.set("accessToken", authToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      console.log("No auth token found in response");
    }

    return nextResponse;
  } catch (error) {
    console.error("Error in GraphQL proxy:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PATCH and GET remain unchanged
