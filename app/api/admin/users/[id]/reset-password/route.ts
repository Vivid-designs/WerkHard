import { type NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Gebruiker ontbreek." }, { status: 400 });
  }

  const { email } = (await request.json()) as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "E-pos ontbreek." }, { status: 400 });
  }

  try {
    const { error } = await getSupabaseAdmin().auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/login?reset=true`,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/reset-password]", error);
    return NextResponse.json({ error: "Kon nie herstel-e-pos stuur nie." }, { status: 500 });
  }
}
