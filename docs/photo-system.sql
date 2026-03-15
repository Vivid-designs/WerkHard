-- 1. Photo entries
create table if not exists public.photo_entries (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text not null unique,
  caption text,
  display_type text not null default 'single' check (display_type in ('single', 'gallery')),
  published boolean not null default false,
  featured boolean not null default false,
  author_id uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists photo_entries_updated_at on public.photo_entries;
create trigger photo_entries_updated_at
before update on public.photo_entries
for each row
execute function public.set_updated_at();

-- 2. Images per entry
create table if not exists public.photo_images (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.photo_entries (id) on delete cascade,
  image_url text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photo_images_entry_id_sort
on public.photo_images (entry_id, sort_order);

-- 3. People tags
create table if not exists public.photo_people_tags (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.photo_entries (id) on delete cascade,
  name text not null,
  handle text,
  created_at timestamptz not null default now()
);

-- 4. RLS
alter table public.photo_entries enable row level security;
alter table public.photo_images enable row level security;
alter table public.photo_people_tags enable row level security;

drop policy if exists "Public can read published photo entries" on public.photo_entries;
create policy "Public can read published photo entries"
on public.photo_entries for select
using (published = true);

drop policy if exists "Public can read photo images" on public.photo_images;
create policy "Public can read photo images"
on public.photo_images for select
using (
  exists (
    select 1 from public.photo_entries
    where id = entry_id and published = true
  )
);

drop policy if exists "Public can read people tags" on public.photo_people_tags;
create policy "Public can read people tags"
on public.photo_people_tags for select
using (
  exists (
    select 1 from public.photo_entries
    where id = entry_id and published = true
  )
);

drop policy if exists "Admins full access to photo entries" on public.photo_entries;
create policy "Admins full access to photo entries"
on public.photo_entries for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
);

drop policy if exists "Admins full access to photo images" on public.photo_images;
create policy "Admins full access to photo images"
on public.photo_images for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
);

drop policy if exists "Admins full access to people tags" on public.photo_people_tags;
create policy "Admins full access to people tags"
on public.photo_people_tags for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
);

-- 5. Storage
insert into storage.buckets (id, name, public)
values ('photo-images', 'photo-images', true)
on conflict do nothing;

drop policy if exists "Public can view photo images" on storage.objects;
create policy "Public can view photo images"
on storage.objects for select
using (bucket_id = 'photo-images');

drop policy if exists "Admins can upload photo images" on storage.objects;
create policy "Admins can upload photo images"
on storage.objects for insert
with check (
  bucket_id = 'photo-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
);

drop policy if exists "Admins can delete photo images" on storage.objects;
create policy "Admins can delete photo images"
on storage.objects for delete
using (
  bucket_id = 'photo-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
);
