import type { User } from "@supabase/supabase-js";

const ADMIN_EMAIL_ALLOWLIST = (process.env.NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function roleIncludesAdmin(role: unknown): boolean {
  if (typeof role === "string") {
    return role.trim().toLowerCase() === "admin";
  }

  if (Array.isArray(role)) {
    return role.some((entry) => roleIncludesAdmin(entry));
  }

  return false;
}

function hasAdminRoleInMetadata(user: User): boolean {
  return (
    roleIncludesAdmin(user.app_metadata?.role) ||
    roleIncludesAdmin(user.user_metadata?.role) ||
    roleIncludesAdmin(user.app_metadata?.user_role) ||
    roleIncludesAdmin(user.user_metadata?.user_role) ||
    roleIncludesAdmin(user.app_metadata?.roles) ||
    roleIncludesAdmin(user.user_metadata?.roles)
  );
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
