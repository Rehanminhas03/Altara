import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

/**
 * Data Access Layer for admin auth. The authoritative security boundary —
 * every admin page and server action goes through `requireAdmin()`. Memoised
 * per-request with React `cache` so repeated calls don't re-hit the network.
 */
export const getAdminSession = cache(async () => {
  if (!isSupabaseConfigured()) return { user: null, isAdmin: false as const };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false as const };

  const { data, error } = await supabase.rpc("is_admin");
  return { user, isAdmin: Boolean(data) && !error };
});

/** Redirects unless the caller is an authenticated admin. Returns the user. */
export async function requireAdmin() {
  const { user, isAdmin } = await getAdminSession();
  if (!user) redirect("/admin/login");
  if (!isAdmin) redirect("/admin/login?error=not_admin");
  return user;
}
