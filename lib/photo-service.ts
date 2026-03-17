import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "./supabase-admin";

export interface PhotoImage {
  id: string;
  entry_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
}

export interface PeopleTag {
  id: string;
  name: string;
  handle: string | null;
}

export type DisplayType = "single" | "gallery";

export interface PhotoEntry {
  id: string;
  title: string | null;
  slug: string;
  caption: string | null;
  display_type: DisplayType;
  published: boolean;
  featured: boolean;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  images: PhotoImage[];
  people_tags: PeopleTag[];
}

export interface PhotoInput {
  title?: string;
  slug: string;
  caption?: string;
  display_type: DisplayType;
  published?: boolean;
  featured?: boolean;
  author_id?: string;
  images?: Omit<PhotoImage, "id" | "entry_id">[];
  people_tags?: Omit<PeopleTag, "id">[];
}

export function normalizePhotoSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/g, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/^fotos\//, "")
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-");
}

async function attachRelated(entries: Array<Record<string, any>>): Promise<PhotoEntry[]> {
  if (!entries.length) return [];

  const ids = entries.map((entry) => entry.id);
  const supabaseAdmin = getSupabaseAdmin();

  const [{ data: images }, { data: tags }] = await Promise.all([
    supabaseAdmin
      .from("photo_images")
      .select("id, entry_id, image_url, alt_text, caption, sort_order")
      .in("entry_id", ids)
      .order("sort_order"),
    supabaseAdmin.from("photo_people_tags").select("id, entry_id, name, handle").in("entry_id", ids),
  ]);

  const imagesMap = new Map<string, PhotoImage[]>();
  for (const image of images ?? []) {
    const existing = imagesMap.get(image.entry_id) ?? [];
    existing.push(image as PhotoImage);
    imagesMap.set(image.entry_id, existing);
  }

  const tagsMap = new Map<string, PeopleTag[]>();
  for (const tag of tags ?? []) {
    const existing = tagsMap.get(tag.entry_id) ?? [];
    existing.push({ id: tag.id, name: tag.name, handle: tag.handle });
    tagsMap.set(tag.entry_id, existing);
  }

  return entries.map((entry) => ({
    ...entry,
    images: imagesMap.get(entry.id) ?? [],
    people_tags: tagsMap.get(entry.id) ?? [],
  })) as PhotoEntry[];
}

export async function getAllPhotoEntriesAdmin(): Promise<PhotoEntry[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("photo_entries")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[photo-service] getAllPhotoEntriesAdmin", error.message);
    return [];
  }

  return attachRelated(data ?? []);
}

export async function getPublishedPhotoEntries(): Promise<PhotoEntry[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("photo_entries")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[photo-service] getPublishedPhotoEntries", error.message);
    return [];
  }

  return attachRelated(data ?? []);
}

function decodePhotoSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function getPhotoEntryBySlug(slug: string): Promise<PhotoEntry | null> {
  const decodedSlug = decodePhotoSlug(slug);
  const plusDecodedSlug = decodedSlug.replace(/\+/g, " ");

  const slugCandidates = Array.from(
    new Set([
      slug,
      decodedSlug,
      plusDecodedSlug,
      normalizePhotoSlug(slug),
      normalizePhotoSlug(decodedSlug),
      normalizePhotoSlug(plusDecodedSlug),
    ].filter(Boolean)),
  );

  const { data } = await getSupabaseAdmin()
    .from("photo_entries")
    .select("*")
    .in("slug", slugCandidates)
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  if (data) {
    const [entry] = await attachRelated([data]);
    return entry ?? null;
  }

  const { data: publishedEntries, error } = await getSupabaseAdmin().from("photo_entries").select("*").eq("published", true);
  if (error || !publishedEntries) return null;

  const normalizedCandidates = new Set(slugCandidates.map((candidate) => normalizePhotoSlug(candidate)).filter(Boolean));

  const matched = publishedEntries.find((entry) => {
    if (slugCandidates.includes(entry.slug)) return true;
    return normalizedCandidates.has(normalizePhotoSlug(entry.slug));
  });

  if (!matched) return null;

  const [entry] = await attachRelated([matched]);
  return entry ?? null;
}

export async function getPhotoEntryById(id: string): Promise<PhotoEntry | null> {
  const { data, error } = await getSupabaseAdmin().from("photo_entries").select("*").eq("id", id).single();

  if (error || !data) return null;

  const [entry] = await attachRelated([data]);
  return entry ?? null;
}

async function syncImages(entryId: string, images: Omit<PhotoImage, "id" | "entry_id">[]): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();

  await supabaseAdmin.from("photo_images").delete().eq("entry_id", entryId);

  if (!images.length) return;

  const { error } = await supabaseAdmin.from("photo_images").insert(
    images.map((image, index) => ({
      entry_id: entryId,
      image_url: image.image_url,
      alt_text: image.alt_text ?? null,
      caption: image.caption ?? null,
      sort_order: image.sort_order ?? index,
    })),
  );

  if (error) {
    throw new Error(`Image sync failed: ${error.message}`);
  }
}

async function syncPeopleTags(entryId: string, tags: Omit<PeopleTag, "id">[]): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();

  await supabaseAdmin.from("photo_people_tags").delete().eq("entry_id", entryId);

  if (!tags.length) return;

  const { error } = await supabaseAdmin.from("photo_people_tags").insert(
    tags.map((tag) => ({
      entry_id: entryId,
      name: tag.name,
      handle: tag.handle ?? null,
    })),
  );

  if (error) {
    throw new Error(`Tags sync failed: ${error.message}`);
  }
}

export async function createPhotoEntry(input: PhotoInput): Promise<PhotoEntry> {
  const { images, people_tags, ...fields } = input;

  const { data, error } = await getSupabaseAdmin()
    .from("photo_entries")
    .insert({
      title: fields.title ?? null,
      slug: normalizePhotoSlug(fields.slug),
      caption: fields.caption ?? null,
      display_type: fields.display_type,
      published: fields.published ?? false,
      featured: fields.featured ?? false,
      author_id: fields.author_id ?? null,
      published_at: fields.published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create photo entry");
  }

  if (images?.length) await syncImages(data.id, images);
  if (people_tags?.length) await syncPeopleTags(data.id, people_tags);

  revalidatePath("/fotos");

  const [entry] = await attachRelated([data]);
  return entry as PhotoEntry;
}

export async function updatePhotoEntry(id: string, input: Partial<PhotoInput>): Promise<PhotoEntry> {
  const { images, people_tags, ...fields } = input;
  const payload: Record<string, any> = {};

  if (fields.title !== undefined) payload.title = fields.title;
  if (fields.slug !== undefined) payload.slug = normalizePhotoSlug(fields.slug);
  if (fields.caption !== undefined) payload.caption = fields.caption;
  if (fields.display_type !== undefined) payload.display_type = fields.display_type;
  if (fields.featured !== undefined) payload.featured = fields.featured;

  if (fields.published !== undefined) {
    payload.published = fields.published;
    payload.published_at = fields.published ? new Date().toISOString() : null;
  }

  if (Object.keys(payload).length > 0) {
    const { error } = await getSupabaseAdmin().from("photo_entries").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (images !== undefined) await syncImages(id, images);
  if (people_tags !== undefined) await syncPeopleTags(id, people_tags);

  revalidatePath("/fotos");

  const entry = await getPhotoEntryById(id);
  if (!entry) throw new Error("Not found after update");

  revalidatePath(`/fotos/${entry.slug}`);
  return entry;
}

export async function deletePhotoEntry(id: string): Promise<void> {
  const entry = await getPhotoEntryById(id);

  const { error } = await getSupabaseAdmin().from("photo_entries").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/fotos");
  if (entry) revalidatePath(`/fotos/${entry.slug}`);
}

export async function togglePhotoPublished(id: string, published: boolean): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("photo_entries")
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const entry = await getPhotoEntryById(id);
  revalidatePath("/fotos");
  if (entry) revalidatePath(`/fotos/${entry.slug}`);
}
