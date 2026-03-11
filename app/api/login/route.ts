import { NextResponse } from "next/server";
import { isValidAdminLogin } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!isValidAdminLogin(email ?? "", password ?? "")) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: "wh_admin",
    value: "true",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  response.cookies.set({
    name: "wh_admin_email",
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
