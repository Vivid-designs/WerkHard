import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { createPhotoEntry, getAllPhotoEntriesAdmin, type PhotoInput } from "@/lib/photo-service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const entries = await getAllPhotoEntriesAdmin();
  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (!admin) {
    console.error("[api/photos] Unauthorized create request", {
      hasAuthorizationHeader: Boolean(request.headers.get("authorization")),
      hasCookieHeader: Boolean(request.headers.get("cookie")),
    });
    return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PhotoInput;
    const entry = await createPhotoEntry({ ...body, author_id: admin.userId });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    console.error("[api/photos] create failed", {
      userId: admin.userId,
      message: error?.message ?? "Unknown error",
    });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
