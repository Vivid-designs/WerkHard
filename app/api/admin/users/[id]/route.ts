import { type NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdminUser(request);
  if (!admin) {
    return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });
  }

  const { id } = params;
  const body = (await request.json()) as Record<string, unknown>;
  const action = body.action as string;

  if (id === admin.userId && ["block", "remove_admin"].includes(action)) {
    return NextResponse.json(
      { error: "Jy kan nie jouself blokkeer of afgradering nie." },
      { status: 400 },
    );
  }

  try {
    switch (action) {
      case "block":
        await getSupabaseAdmin()
          .from("profiles")
          .update({ blocked: true, blocked_at: new Date().toISOString() })
          .eq("id", id);
        break;
      case "unblock":
        await getSupabaseAdmin()
          .from("profiles")
          .update({ blocked: false, blocked_at: null })
          .eq("id", id);
        break;
      case "set_admin":
        await getSupabaseAdmin().from("profiles").update({ is_admin: true, role: "admin" }).eq("id", id);
        break;
      case "remove_admin":
        await getSupabaseAdmin().from("profiles").update({ is_admin: false, role: "normal" }).eq("id", id);
        break;
      case "set_super_lario":
        await getSupabaseAdmin().from("profiles").update({ role: "super_lario" }).eq("id", id);
        break;
      case "remove_super_lario":
        await getSupabaseAdmin().from("profiles").update({ role: "normal" }).eq("id", id);
        break;
      case "update_profile": {
        const { full_name } = body as { full_name?: string };
        await getSupabaseAdmin()
          .from("profiles")
          .update({ full_name: full_name ?? null })
          .eq("id", id);
        break;
      }
      default:
        return NextResponse.json({ error: "Onbekende aksie." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/users PATCH ${action}]`, error);
    return NextResponse.json({ error: "Aksie het misluk." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdminUser(request);
  if (!admin) {
    return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });
  }

  const { id } = params;

  if (id === admin.userId) {
    return NextResponse.json({ error: "Jy kan nie jou eie rekening verwyder nie." }, { status: 400 });
  }

  try {
    const { error } = await getSupabaseAdmin().auth.admin.deleteUser(id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/users DELETE]", error);
    return NextResponse.json({ error: "Kon nie gebruiker verwyder nie." }, { status: 500 });
  }
}
