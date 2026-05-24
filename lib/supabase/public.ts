import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only anonymous Supabase client (no cookies).
 * Use for catalog reads inside unstable_cache so entries are not tied to sessions.
 * RLS for anon role must allow SELECT on storefront tables.
 */
let browserless: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient {
  if (browserless) return browserless;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required");
  }
  browserless = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return browserless;
}
