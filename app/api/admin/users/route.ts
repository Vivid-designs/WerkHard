import { NextResponse } from "next/server";
import { fetchAllUsers, requireAdminUser } from "@/lib/admin-users";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });
  }

  try {
    const users = await fetchAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("[admin/users GET]", error);
    return NextResponse.json({ error: "Kon nie gebruikers laai nie." }, { status: 500 });
  }
}
