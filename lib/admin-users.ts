import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  blocked: boolean;
  blocked_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  blocked: boolean;
  blocked_at: string | null;
  created_at: string;
}

function tryParseCookieToken(rawValue: string): string | null {
  const value = decodeURIComponent(rawValue);

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed[0];
    }

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "access_token" in parsed &&
      typeof (parsed as { access_token?: unknown }).access_token === "string"
    ) {
      return (parsed as { access_token: string }).access_token;
    }
  } catch {
    return null;
  }

  return null;
}

function getAccessTokenFromSupabaseCookie(): string | null {
  const cookieStore = cookies();
  const authCookie = cookieStore
    .getAll()
    .find((cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"));

  if (!authCookie) return null;

  return tryParseCookieToken(authCookie.value);
}

export async function requireAdminUser(): Promise<{ userId: string } | null> {
  const accessToken = getAccessTokenFromSupabaseCookie();

  if (!accessToken) {
    return null;
  }

  const {
    data: { user },
    error: userError,
  } = await getSupabaseAdmin().auth.getUser(accessToken);

  if (userError || !user) return null;

  const { data: profile } = await getSupabaseAdmin()
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return null;

  return { userId: user.id };
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const {
    data: { users: authUsers },
    error: authError,
  } = await getSupabaseAdmin().auth.admin.listUsers({ perPage: 500 });

  if (authError || !authUsers) return [];

  const { data: profiles } = await getSupabaseAdmin()
    .from("profiles")
    .select("id, full_name, is_admin, blocked, blocked_at, created_at");

  const profileMap = new Map(
    ((profiles as ProfileRow[] | null | undefined) ?? []).map((profile) => [profile.id, profile]),
  );

  return authUsers.map((authUser) => {
    const profile = profileMap.get(authUser.id);
    return {
      id: authUser.id,
      email: authUser.email ?? "",
      full_name: profile?.full_name ?? null,
      is_admin: profile?.is_admin ?? false,
      blocked: profile?.blocked ?? false,
      blocked_at: profile?.blocked_at ?? null,
      created_at: profile?.created_at ?? authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at ?? null,
    };
  });
}
