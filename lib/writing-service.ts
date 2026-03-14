/**
 * Server-side only — import only in API routes and server components.
 */
import { getSupabaseAdmin } from "./supabase-admin";

function getClient() {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  accent: string;
}

export interface WritingPiece {
  id: string;
  title: string;
  subtitle: string | null;
  tagline: string | null;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  published: boolean;
  featured: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  categories: Category[];
}

export interface WritingInput {
  title: string;
  subtitle?: string;
  tagline?: string;
  slug: string;
  excerpt?: string;
  body?: string;
  cover_image_url?: string;
  published?: boolean;
  featured?: boolean;
  category_ids?: string[];
  author_id?: string;
}

async function attachCategories(pieces: any[]): Promise<WritingPiece[]> {
  if (!pieces.length) return [];
  const client = getClient();
  if (!client) return pieces.map((p) => ({ ...p, categories: [] }));

  const ids = pieces.map((p) => p.id);
  const { data: junctions } = await client
    .from("writing_categories")
    .select("writing_id, categories(id, name, slug, accent)")
    .in("writing_id", ids);

  const catMap = new Map<string, Category[]>();
  (junctions ?? []).forEach((j: any) => {
    const existing = catMap.get(j.writing_id) ?? [];
    if (j.categories) existing.push(j.categories as Category);
    catMap.set(j.writing_id, existing);
  });

  return pieces.map((p) => ({ ...p, categories: catMap.get(p.id) ?? [] }));
}

export async function getAllWritingAdmin(): Promise<WritingPiece[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("writing").select("*").order("updated_at", { ascending: false });
  if (error || !data) return [];
  return attachCategories(data);
}

export async function getPublishedWriting(): Promise<WritingPiece[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("writing")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return attachCategories(data);
}

export async function getWritingBySlug(slug: string): Promise<WritingPiece | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from("writing")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error || !data) return null;
  const [piece] = await attachCategories([data]);
  return piece ?? null;
}

export async function getWritingById(id: string): Promise<WritingPiece | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("writing").select("*").eq("id", id).single();
  if (error || !data) return null;
  const [piece] = await attachCategories([data]);
  return piece ?? null;
}

export async function getAllCategories(): Promise<Category[]> {
  const client = getClient();
  if (!client) return [];
  const { data } = await client.from("categories").select("*").order("name");
  return data ?? [];
}

async function syncCategories(writingId: string, categoryIds: string[]): Promise<void> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");
  await client.from("writing_categories").delete().eq("writing_id", writingId);
  if (!categoryIds.length) return;
  await client.from("writing_categories").insert(
    categoryIds.map((cid) => ({ writing_id: writingId, category_id: cid })),
  );
}

export async function createWriting(input: WritingInput): Promise<WritingPiece> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { category_ids, ...fields } = input;
  const { data, error } = await client.from("writing").insert(fields).select().single();
  if (error || !data) throw new Error(error?.message ?? "Create failed");
  if (category_ids?.length) await syncCategories(data.id, category_ids);
  const [piece] = await attachCategories([data]);
  return piece as WritingPiece;
}

export async function updateWriting(id: string, input: Partial<WritingInput>): Promise<WritingPiece> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { category_ids, ...fields } = input;
  if (Object.keys(fields).length) {
    const { error } = await client.from("writing").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
  }
  if (category_ids !== undefined) await syncCategories(id, category_ids);
  const piece = await getWritingById(id);
  if (!piece) throw new Error("Not found after update");
  return piece;
}

export async function deleteWriting(id: string): Promise<void> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { error } = await client.from("writing").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function togglePublished(id: string, published: boolean): Promise<void> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { error } = await client.from("writing").update({ published }).eq("id", id);
  if (error) throw new Error(error.message);
}
