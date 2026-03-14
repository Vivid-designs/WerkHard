import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { togglePublished } from "@/lib/writing-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  const { published } = (await request.json()) as { published: boolean };

  try {
    await togglePublished(params.id, published);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
