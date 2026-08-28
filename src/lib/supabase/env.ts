/**
 * Central place to read Supabase public env vars. Keeping this in one file
 * means the rest of the app can import a validated shape instead of touching
 * `process.env` directly.
 *
 * A missing env value is a soft-fail here (returns empty strings) because
 * Phase 0 must remain runnable before a real Supabase project is connected.
 * Later phases should throw when these are missing at auth boundaries.
 */
export function getSupabasePublicEnv(): {
  url: string;
  publishableKey: string;
  isConfigured: boolean;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
  return {
    url,
    publishableKey,
    isConfigured: url.length > 0 && publishableKey.length > 0,
  };
}
