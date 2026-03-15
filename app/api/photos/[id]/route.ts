import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import {
  deletePhotoEntry,
  getPhotoEntryById,
  updatePhotoEntry,
  type PhotoInput,
} from "@/lib/photo-service";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const entry = await getPhotoEntryById(params.id);
  if (!entry) return NextResponse.json({ error: "Nie gevind nie." }, { status: 404 });

  return NextResponse.json({ entry });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    const body = (await request.json()) as Partial<PhotoInput>;
    const entry = await updatePhotoEntry(params.id, body);
    return NextResponse.json({ entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    await deletePhotoEntry(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
