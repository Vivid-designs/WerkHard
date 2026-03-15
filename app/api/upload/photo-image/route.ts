import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (!admin) {
    console.error("[upload/photo-image] Unauthorized upload request", {
      hasAuthorizationHeader: Boolean(request.headers.get("authorization")),
      hasCookieHeader: Boolean(request.headers.get("cookie")),
    });
    return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    console.error("[upload/photo-image] Upload request missing file field", { userId: admin.userId });
    return NextResponse.json({ error: "Geen lêer ontvang nie." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.storage.from("photo-images").upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("[upload/photo-image] Storage upload failed", {
      userId: admin.userId,
      filename,
      error: error.message,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("photo-images").getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
