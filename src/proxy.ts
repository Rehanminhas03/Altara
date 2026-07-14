import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * Proxy (Next.js 16's renamed middleware). Scoped to `/admin/**` via the
 * matcher below, so it never runs on public routes or static assets.
 *
 * It performs an optimistic auth check (redirect unauthenticated users to the
 * login page) and refreshes the Supabase session cookies. The AUTHORITATIVE
 * admin check (`is_admin()`) happens in the admin DAL and every server action —
 * proxy is not the only line of defence.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  let response = NextResponse.next({ request });

  // If the DB isn't configured yet, don't lock anyone out — the admin pages
  // themselves show a "not configured" state.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic gate: bounce unauthenticated users to login. The authoritative
  // admin check happens in the admin layout / DAL. (We intentionally do NOT
  // redirect authenticated users away from /login — the login page verifies
  // admin status itself, which avoids a redirect loop for non-admin sessions.)
  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
