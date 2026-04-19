alter table public.writing
  add column if not exists access_level text not null default 'public'
  check (access_level in ('public', 'members', 'super_lario', 'admin_only'));
