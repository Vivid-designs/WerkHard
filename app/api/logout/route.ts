import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: "wh_admin",
    value: "",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: "wh_admin_email",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
