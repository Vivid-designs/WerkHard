import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

const FALLBACK_SUPABASE_URL = "https://example.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.signature";

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY,
    );
  }

  return client;
}
