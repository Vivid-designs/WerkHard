# Authentication architecture

Admin access is enforced through **one model only**: Supabase Auth sessions plus admin role checks.

## Source of truth

- Users sign in through Supabase (`supabase.auth.signInWithPassword`) on `/login`.
- Session state is hydrated and tracked in `AuthProvider` (`context/AuthContext.tsx`).
- Admin authorization is computed by `isAdminUser` (`lib/admin-guard.ts`) using:
  - `role`/`user_role` in Supabase user metadata, or
  - `NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST`.

## Route behavior

- `/dashboard` is protected by `app/dashboard/layout.tsx`; non-admin users are redirected to `/login`.
- Public pages can redirect authenticated admins into `/dashboard` from `components/layout/PublicLayoutWrapper.tsx`.

## Removed legacy auth path

The previous cookie-based admin gate (`wh_admin`, `wh_admin_email`) and hardcoded email/password API endpoints were removed.
Do not reintroduce custom auth cookies or local credential checks; always use Supabase session + role checks.
