import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { getWritingById, updateWriting, deleteWriting, type WritingInput } from "@/lib/writing-service";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const piece = await getWritingById(params.id);
  if (!piece) return NextResponse.json({ error: "Nie gevind nie." }, { status: 404 });

  return NextResponse.json({ piece });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const body = (await request.json()) as Partial<WritingInput>;

  try {
    const piece = await updateWriting(params.id, body);
    return NextResponse.json({ piece });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    await deleteWriting(params.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
