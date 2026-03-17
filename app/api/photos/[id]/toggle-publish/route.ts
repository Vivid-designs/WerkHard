import { NextResponse, type NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/admin-users";
import { togglePhotoPublished } from "@/lib/photo-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminUser(request);
  if (!admin) return NextResponse.json({ error: "Ongemagtig." }, { status: 401 });

  try {
    const { published } = (await request.json()) as { published: boolean };
    await togglePhotoPublished(params.id, published);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
