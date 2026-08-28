import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabasePublicEnv } from './env';

/**
 * Server Supabase client for React Server Components, Route Handlers, and
 * Server Actions. Uses the modern getAll/setAll cookie adapter required by
 * `@supabase/ssr` — do NOT reintroduce the deprecated get/set/remove trio.
 *
 * The setAll call is wrapped in try/catch because Server Components are not
 * allowed to mutate cookies; the middleware refresh flow handles that.
 */
export function createClient() {
  const cookieStore = cookies();
  const { url, publishableKey } = getSupabasePublicEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — the middleware will refresh
          // the session on the next request. This is expected.
        }
      },
    },
  });
}
