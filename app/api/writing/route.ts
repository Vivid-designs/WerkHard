import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-users";
import {
  getAllWritingAdmin,
  createWriting,
  getAllCategories,
  type WritingInput,
} from "@/lib/writing-service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const [pieces, categories] = await Promise.all([getAllWritingAdmin(), getAllCategories()]);

  return NextResponse.json({ pieces, categories });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    const body = (await request.json()) as WritingInput;
    if (!body?.title || !body?.slug) {
      return NextResponse.json({ error: "Titel en slug is verpligtend." }, { status: 400 });
    }

    const piece = await createWriting({ ...body, author_id: admin.userId });

    // Ensure fresh public/admin data after creation.
    revalidatePath("/skryf");
    revalidatePath(`/skryf/${piece.slug}`);
    revalidatePath("/dashboard/writing");

    return NextResponse.json({ piece }, { status: 201 });
  } catch (e: any) {
    console.error("[api/writing] create failed", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
