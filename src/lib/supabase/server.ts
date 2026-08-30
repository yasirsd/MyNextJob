import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabasePublicEnv } from './env';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Server Supabase client for React Server Components, Route Handlers, and
 * Server Actions. Uses the modern getAll/setAll cookie adapter required by
 * `@supabase/ssr` — do NOT reintroduce the deprecated get/set/remove trio.
 *
 * `cookies()` is async in Next.js 16. The setAll call is wrapped in
 * try/catch because Server Components cannot mutate cookies; the
 * `src/proxy.ts` session-refresh helper writes cookies on the response.
 *
 * Newer `@supabase/ssr` releases pass cache headers as the second `setAll`
 * argument. We accept them so an upgrade does not silently drop CDN
 * protection. Server Components cannot apply those headers; Proxy can.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabasePublicEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[], _headers?: Record<string, string>) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — proxy refresh writes the
          // session on the next request. This is expected.
        }
      },
    },
  });
}
