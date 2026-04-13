/**
 * Server-side only — import only in API routes and server components.
 */
import { getSupabaseAdmin } from "./supabase-admin";
import type { AccessLevel, UserRole } from "./types";

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
  access_level: AccessLevel;
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
  access_level?: AccessLevel;
  category_ids?: string[];
  author_id?: string;
}

type DbRow = Record<string, unknown>;

interface WritingColumns {
  body: "body" | "content";
  published: "published" | "is_published";
}

let columnsPromise: Promise<WritingColumns> | null = null;

async function detectColumn(
  candidateColumns: string[],
  fallback: string,
): Promise<string> {
  const client = getClient();
  if (!client) return fallback;

  const { data, error } = await client
    .from("information_schema.columns")
    .select("column_name")
    .eq("table_schema", "public")
    .eq("table_name", "writing")
    .in("column_name", candidateColumns);

  if (error || !data) return fallback;

  const names = new Set(
    data
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const name = (row as { column_name?: unknown }).column_name;
        return typeof name === "string" ? name : null;
      })
      .filter((name): name is string => Boolean(name)),
  );

  for (const c of candidateColumns) {
    if (names.has(c)) return c;
  }

  return fallback;
}

async function getWritingColumns(): Promise<WritingColumns> {
  if (!columnsPromise) {
    columnsPromise = (async () => {
      const [body, published] = await Promise.all([
        detectColumn(["body", "content"], "body"),
        detectColumn(["published", "is_published"], "published"),
      ]);

      return {
        body: body === "content" ? "content" : "body",
        published: published === "is_published" ? "is_published" : "published",
      };
    })();
  }

  return columnsPromise;
}

function normalizeRow(row: DbRow): WritingPiece {
  return {
    id: String(row.id ?? ""),
    title: (row.title as string | null) ?? "",
    subtitle: (row.subtitle as string | null) ?? null,
    tagline: (row.tagline as string | null) ?? null,
    slug: (row.slug as string | null) ?? "",
    excerpt: (row.excerpt as string | null) ?? null,
    body: ((row.body as string | null) ?? (row.content as string | null) ?? null),
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    published: Boolean((row.published as boolean | null) ?? (row.is_published as boolean | null) ?? false),
    featured: Boolean((row.featured as boolean | null) ?? false),
    author_id: (row.author_id as string | null) ?? null,
    access_level: ((row.access_level as string | null) ?? "public") as AccessLevel,
    created_at: (row.created_at as string | null) ?? "",
    updated_at: (row.updated_at as string | null) ?? "",
    categories: [],
  };
}

function allowedAccessLevels(role: UserRole | null): AccessLevel[] {
  const levels: AccessLevel[] = ["public"];
  if (role) levels.push("members");
  if (role === "super_lario" || role === "admin") levels.push("super_lario");
  if (role === "admin") levels.push("admin_only");
  return levels;
}

async function attachCategories(pieces: DbRow[]): Promise<WritingPiece[]> {
  if (!pieces.length) return [];
  const client = getClient();
  if (!client) return pieces.map((p) => ({ ...normalizeRow(p), categories: [] }));

  const ids = pieces.map((p) => String(p.id));
  const { data: junctions, error } = await client
    .from("writing_categories")
    .select("writing_id, categories(id, name, slug, accent)")
    .in("writing_id", ids);

  if (error) {
    console.error("[writing-service] Failed to load categories", error);
    return pieces.map((p) => ({ ...normalizeRow(p), categories: [] }));
  }

  const catMap = new Map<string, Category[]>();
  (junctions ?? []).forEach((j: any) => {
    const existing = catMap.get(j.writing_id) ?? [];
    if (j.categories) existing.push(j.categories as Category);
    catMap.set(j.writing_id, existing);
  });

  return pieces.map((p) => ({ ...normalizeRow(p), categories: catMap.get(String(p.id)) ?? [] }));
}

export async function getAllWritingAdmin(): Promise<WritingPiece[]> {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client.from("writing").select("*").order("updated_at", { ascending: false });
  if (error || !data) {
    console.error("[writing-service] getAllWritingAdmin failed", error);
    return [];
  }

  return attachCategories(data as DbRow[]);
}

export async function getPublishedWritingForRole(role: UserRole | null): Promise<WritingPiece[]> {
  const client = getClient();
  if (!client) return [];

  const columns = await getWritingColumns();
  const allowed = allowedAccessLevels(role);

  const { data, error } = await client
    .from("writing")
    .select("*")
    .eq(columns.published, true)
    .in("access_level", allowed)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[writing-service] getPublishedWritingForRole failed", error);
    return [];
  }

  return attachCategories(data as DbRow[]);
}

export async function getWritingBySlugForRole(slug: string, role: UserRole | null): Promise<WritingPiece | null> {
  const client = getClient();
  if (!client) return null;

  const columns = await getWritingColumns();
  const allowed = allowedAccessLevels(role);

  const { data, error } = await client
    .from("writing")
    .select("*")
    .eq("slug", slug)
    .eq(columns.published, true)
    .in("access_level", allowed)
    .single();

  if (error || !data) return null;

  const [piece] = await attachCategories([data as DbRow]);
  return piece ?? null;
}

export async function getPublishedWriting(): Promise<WritingPiece[]> {
  const client = getClient();
  if (!client) return [];

  const columns = await getWritingColumns();
  const { data, error } = await client
    .from("writing")
    .select("*")
    .eq(columns.published, true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[writing-service] getPublishedWriting failed", error);
    return [];
  }

  return attachCategories(data as DbRow[]);
}

export async function getWritingBySlug(slug: string): Promise<WritingPiece | null> {
  const client = getClient();
  if (!client) return null;

  const columns = await getWritingColumns();
  const { data, error } = await client
    .from("writing")
    .select("*")
    .eq("slug", slug)
    .eq(columns.published, true)
    .single();

  if (error || !data) {
    console.error("[writing-service] getWritingBySlug failed", error);
    return null;
  }

  const [piece] = await attachCategories([data as DbRow]);
  return piece ?? null;
}

export async function getWritingById(id: string): Promise<WritingPiece | null> {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client.from("writing").select("*").eq("id", id).single();
  if (error || !data) {
    console.error("[writing-service] getWritingById failed", error);
    return null;
  }

  const [piece] = await attachCategories([data as DbRow]);
  return piece ?? null;
}

export async function getAllCategories(): Promise<Category[]> {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client.from("categories").select("*").order("name");
  if (error) {
    console.error("[writing-service] getAllCategories failed", error);
  }

  return (data ?? []) as Category[];
}

async function syncCategories(writingId: string, categoryIds: string[]): Promise<void> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");

  const { error: deleteError } = await client.from("writing_categories").delete().eq("writing_id", writingId);
  if (deleteError) throw new Error(`Category unlink failed: ${deleteError.message}`);

  if (!categoryIds.length) return;

  const { error: insertError } = await client.from("writing_categories").insert(
    categoryIds.map((cid) => ({ writing_id: writingId, category_id: cid })),
  );
  if (insertError) throw new Error(`Category link failed: ${insertError.message}`);
}

export async function createWriting(input: WritingInput): Promise<WritingPiece> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");

  const columns = await getWritingColumns();
  const { category_ids, body, published, access_level, ...rest } = input;
  const fields: Record<string, unknown> = {
    ...rest,
    [columns.body]: body,
    [columns.published]: published,
    access_level: access_level ?? "public",
  };

  const { data, error } = await client.from("writing").insert(fields).select().single();
  if (error || !data) {
    console.error("[writing-service] createWriting failed", { error, fields });
    throw new Error(error?.message ?? "Create failed");
  }

  if (category_ids?.length) await syncCategories(String((data as DbRow).id), category_ids);
  const [piece] = await attachCategories([data as DbRow]);
  return piece as WritingPiece;
}

export async function updateWriting(id: string, input: Partial<WritingInput>): Promise<WritingPiece> {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");

  const columns = await getWritingColumns();
  const { category_ids, body, published, access_level, ...rest } = input;
  const fields: Record<string, unknown> = { ...rest };

  if (body !== undefined) fields[columns.body] = body;
  if (published !== undefined) fields[columns.published] = published;
  if (access_level !== undefined) fields.access_level = access_level;

  if (Object.keys(fields).length) {
    const { error } = await client.from("writing").update(fields).eq("id", id);
    if (error) {
      console.error("[writing-service] updateWriting failed", { error, id, fields });
      throw new Error(error.message);
    }
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

  const columns = await getWritingColumns();
  const { error } = await client.from("writing").update({ [columns.published]: published }).eq("id", id);
  if (error) throw new Error(error.message);
}
