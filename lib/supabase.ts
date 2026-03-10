// Uncomment everything below once you have Supabase credentials.

// import { createClient } from "@supabase/supabase-js";
// import type { Database } from "./database.types";
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
//
// export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Server-side client (Route Handlers / Server Components):
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
//
// export function createSupabaseServerClient() {
//   const cookieStore = cookies();
//   return createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     { cookies: { getAll: () => cookieStore.getAll() } }
//   );
// }

export {};
