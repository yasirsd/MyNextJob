import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicEnv } from './env';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const AUTH_CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
  Expires: '0',
  Pragma: 'no-cache',
};

function applyResponseHeaders(response: NextResponse, headers: Record<string, string>): void {
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}

/**
 * Session-refresh helper for the Next.js 16 `proxy.ts` convention.
 *
 * Refreshes cookies via `getClaims()` (trusted JWT verification). Does not
 * load profiles, query the database, or enforce login redirects — those
 * belong on protected Server Components / layouts.
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
      setAll(cookiesToSet: CookieToSet[], headers?: Record<string, string>) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
        applyResponseHeaders(supabaseResponse, headers && Object.keys(headers).length > 0 ? headers : AUTH_CACHE_HEADERS);
      },
    },
  });

  // Must run between createServerClient() and returning the response so a
  // near-expiry refresh is written back onto supabaseResponse.
  await supabase.auth.getClaims();

  return supabaseResponse;
}
