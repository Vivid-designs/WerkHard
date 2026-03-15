import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
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

  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Geen velde ontvang om te stoor nie." }, { status: 400 });
  }

  try {
    const existing = await getWritingById(params.id);
    const piece = await updateWriting(params.id, body);

    revalidatePath("/skryf");
    revalidatePath(`/skryf/${piece.slug}`);
    if (existing?.slug && existing.slug !== piece.slug) {
      revalidatePath(`/skryf/${existing.slug}`);
    }
    revalidatePath("/dashboard/writing");

    return NextResponse.json({ piece });
  } catch (e: any) {
    console.error("[api/writing/:id] update failed", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    const existing = await getWritingById(params.id);
    await deleteWriting(params.id);

    revalidatePath("/skryf");
    if (existing?.slug) {
      revalidatePath(`/skryf/${existing.slug}`);
    }
    revalidatePath("/dashboard/writing");

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[api/writing/:id] delete failed", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
