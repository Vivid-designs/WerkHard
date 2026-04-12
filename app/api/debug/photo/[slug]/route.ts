import { NextResponse } from "next/server";
import { getPhotoEntryBySlug } from "@/lib/photo-service";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  // 1. Try the exact lookup the detail page uses
  const entry = await getPhotoEntryBySlug(slug);

  // 2. List ALL entries (published or not) so we can see the real DB state
  const { data: allEntries, error: allEntriesError } = await getSupabaseAdmin()
    .from("photo_entries")
    .select("id, slug, display_type, published, title")
    .order("created_at", { ascending: false });

  // 3. Get image counts per entry
  const { data: imageCounts } = await getSupabaseAdmin()
    .from("photo_images")
    .select("entry_id");

  const countMap: Record<string, number> = {};
  for (const row of imageCounts ?? []) {
    countMap[row.entry_id] = (countMap[row.entry_id] ?? 0) + 1;
  }

  return NextResponse.json({
    lookup: {
      slug,
      found: !!entry,
      display_type: entry?.display_type ?? null,
      image_count: entry?.images.length ?? null,
    },
    all_entries: (allEntries ?? []).map((e: any) => ({
      slug: e.slug,
      title: e.title,
      display_type: e.display_type,
      published: e.published,
      image_count: countMap[e.id] ?? 0,
    })),
    error: allEntriesError?.message ?? null,
  });
}
