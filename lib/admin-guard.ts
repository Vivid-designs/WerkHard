import type { User } from "@supabase/supabase-js";

const ADMIN_EMAIL_ALLOWLIST = (process.env.NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function hasAdminRoleInMetadata(user: User): boolean {
  const metadataRole =
    user.app_metadata?.role ??
    user.user_metadata?.role ??
    user.app_metadata?.user_role ??
    user.user_metadata?.user_role;

  return metadataRole === "admin";
}

function isAllowlistedAdminEmail(user: User): boolean {
  const userEmail = user.email?.toLowerCase();

  return userEmail !== undefined && ADMIN_EMAIL_ALLOWLIST.includes(userEmail);
}

export function isAdminUser(user: User | null): boolean {
  if (user === null) {
    return false;
  }

  return hasAdminRoleInMetadata(user) || isAllowlistedAdminEmail(user);
}
