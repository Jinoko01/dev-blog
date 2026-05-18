import { NextResponse } from "next/server";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
)?.replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const body = await request.json();

    if (!apiBaseUrl) {
      return NextResponse.json(
        {
          error:
            "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.",
        },
        { status: 500 },
      );
    }

    if (!body.filename) {
      return NextResponse.json(
        { error: "Missing filename in request body" },
        { status: 400 },
      );
    }

    const response = await fetch(`${apiBaseUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify({ filename: body.filename }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        data || { error: "Failed to create signed upload URL" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Upload Endpoint Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
