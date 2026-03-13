# Auth flow overview

This project uses **Supabase Auth as the single auth source of truth**.

## Canonical admin route

- `/dashboard` is the canonical admin surface.
- `/admin` is deprecated and immediately redirects to `/dashboard`.

## Login flow

1. User opens `/login`.
2. `app/login/page.tsx` calls `useAuth().signInWithPassword(...)`.
3. `context/AuthContext.tsx` delegates to `supabase.auth.signInWithPassword`.
4. Supabase session updates are tracked via `supabase.auth.onAuthStateChange`.
5. On successful login, the app routes to `/dashboard`.

## Logout flow

- `useAuth().signOut()` delegates to `supabase.auth.signOut()`.
- Shared UI surfaces (`Header`, `AdminHeader`) call `useAuth().signOut()`.
- After sign-out, users are routed to `/login`.

## Role resolution

Admin access is evaluated in `lib/admin-guard.ts` and supports:

- `app_metadata.role === "admin"`
- `app_metadata.user_role === "admin"`
- email allowlist via `NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST`

`AuthContext` exposes the computed `isAdmin` boolean for route and UI guards.

## Protected route strategy

- `app/dashboard/layout.tsx` is the guard for admin pages.
- Non-admin users are redirected to `/login`.
- `components/layout/PublicLayoutWrapper.tsx` redirects authenticated admins from public pages to `/dashboard`.

## Onboarding checklist

- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Ensure admin users have either:
  - `app_metadata.role` or `app_metadata.user_role` set to `admin`, or
  - email added to `NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST`.
- Verify `/admin` redirects to `/dashboard`.
- Verify `/dashboard` redirects non-admin users to `/login`.
- Verify login and logout actions work from both public and admin headers.

## Troubleshooting

- **Login always fails**: confirm Supabase env vars are available to the browser runtime.
- **Logged in but not admin**: verify metadata and allowlist values.
- **Redirect loops**: confirm dashboard guard checks `isLoading` before redirecting.
- **UI shows stale auth state**: ensure `AuthProvider` wraps the app root and `onAuthStateChange` subscription is active.

## Deprecated patterns (do not reintroduce)

- Cookie-based admin auth (`wh_admin`, `wh_admin_email`)
- Local credential validation in custom API routes
- Separate auth implementations for different UI areas
