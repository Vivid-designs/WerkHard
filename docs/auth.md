# Auth architecture

## Canonical admin route

- The canonical admin route is `/dashboard`.
- `/admin` is deprecated and now only performs a redirect to `/dashboard`.
- Do not add new admin features under `/admin`.

## Login flow

1. User visits `/login`.
2. Login form uses `useAuth()` from `context/AuthContext.tsx`.
3. `signInWithPassword(email, password)` calls Supabase Auth (`supabase.auth.signInWithPassword`).
4. On success, user is routed to `/dashboard`.
5. On failure, UI shows a generic credentials error.

## Logout flow

- Logout buttons in both public and dashboard UI call `useAuth().signOut()`.
- `signOut()` delegates to `supabase.auth.signOut()`.
- After sign-out, UI routes the user to `/login`.

## Role resolution

Admin access is resolved by `lib/admin-guard.ts` via:

1. `app_metadata.role === "admin"` (preferred), or fallback role keys (`user_metadata.role`, `app_metadata.user_role`, `user_metadata.user_role`).
2. Email allowlist from `NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST`.

A user is an admin if either role metadata or allowlist check passes.

## Protected route strategy

- Dashboard access is guarded client-side in `app/dashboard/layout.tsx`:
  - while auth state loads, show a loading shell;
  - if loaded and not admin, redirect to `/login`;
  - if admin, render dashboard layout.
- Public routes are wrapped by `components/layout/PublicLayoutWrapper.tsx`:
  - if current user is admin and route is not auth/dashboard bypass, redirect to `/dashboard`.

## Onboarding + admin troubleshooting checklist

- [ ] Confirm new admin users have `app_metadata.role = admin` in Supabase.
- [ ] If metadata cannot be set yet, temporarily add email to `NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST`.
- [ ] Verify login succeeds through `/login` (never through custom cookie endpoints).
- [ ] Verify `/admin` redirects to `/dashboard`.
- [ ] Verify logout from header and dashboard both sign out the same session and return to `/login`.
- [ ] Do not reintroduce cookie-based auth routes or separate auth UI components.
