import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_URL } from "./config";

/**
 * Service-role Supabase client — bypasses RLS. SERVER-ONLY: never import this
 * into a Client Component. Used by admin server actions after re-checking
 * `is_admin()` for the caller. The `server-only` import makes a client import
 * a build error.
 */
export function createSupabaseAdminClient() {
  // Accept both the classic service_role key and the newer "secret" key name.
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    "";
  return createClient<Database>(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
