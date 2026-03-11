import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  hasAdminAuthConfiguration,
  isValidAdminLogin,
} from "@/lib/auth";

export async function POST(req: Request) {
  if (!hasAdminAuthConfiguration()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 500 }
    );
  }

  const { email, password } = await req.json();

  if (!isValidAdminLogin(email ?? "", password ?? "")) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = createAdminSessionToken(email ?? "");

  if (!token) {
    return NextResponse.json(
      { error: "Admin session configuration is invalid." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
