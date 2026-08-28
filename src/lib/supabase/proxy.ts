import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicEnv } from './env';

/**
 * Session-refresh helper for the Next.js 16 `proxy.ts` convention.
 * Auth screens land in Phase 1, at which point `proxy.ts` at the project
 * root will import and call `updateSession()`. This helper exists now so
 * Phase 1 only needs to add the entry file — no architectural refactor.
 *
 * Do NOT add login-required redirects, protected-route rules, or any
 * user-visible auth flow here. Session refresh only.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const { url, publishableKey, isConfigured } = getSupabasePublicEnv();
  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: getUser() must be called between createServerClient() and
  // returning the response — this is what actually refreshes the session
  // cookie when it is about to expire.
  await supabase.auth.getUser();

  return supabaseResponse;
}
