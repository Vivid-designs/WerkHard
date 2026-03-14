import type { UserProfile } from "@/lib/admin-users";

export function sortUsersByNewest(users: UserProfile[]): UserProfile[] {
  return [...users].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}
