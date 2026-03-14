import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import {
  getAllWritingAdmin,
  createWriting,
  getAllCategories,
  type WritingInput,
} from "@/lib/writing-service";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const [pieces, categories] = await Promise.all([getAllWritingAdmin(), getAllCategories()]);

  return NextResponse.json({ pieces, categories });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    const body = (await request.json()) as WritingInput;
    const piece = await createWriting({ ...body, author_id: admin.userId });
    return NextResponse.json({ piece }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
