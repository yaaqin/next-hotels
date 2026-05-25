import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Hanya aktif di environment test/development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const { accessToken, refreshToken, backendUserId } = await req.json();

  // Return token yang akan kita pakai di Cypress
  return NextResponse.json({
    accessToken,
    refreshToken,
    backendUserId,
  });
}