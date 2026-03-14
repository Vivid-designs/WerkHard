import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-users";
import { getWritingById, togglePublished } from "@/lib/writing-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const { published } = (await request.json()) as { published: boolean };

  try {
    const piece = await getWritingById(params.id);
    await togglePublished(params.id, published);

    revalidatePath("/skryf");
    if (piece?.slug) {
      revalidatePath(`/skryf/${piece.slug}`);
    }
    revalidatePath("/dashboard/writing");

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
