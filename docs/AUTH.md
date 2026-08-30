# Authentication

Phase 1 implements email + password auth with Supabase Auth and cookie
SSR. OAuth, magic-link-only login, and phone auth are out of scope.

See also [`ARCHITECTURE.md`](./ARCHITECTURE.md) and the dashboard
checklist below.

## Route model

### Public

- `/` — marketing landing (Get started / Sign in, or Open MyNextJob)
- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/reset-password` — public route; password change requires a recovery session
- `/error` — friendly expired-link state
- `/auth/confirm` — email OTP (`token_hash` + `type`)
- `/auth/callback` — PKCE `code` exchange
- `/design-system`

### Protected (server `getClaims()`)

- `/home`

Future app routes (`/profile`, `/saved`, …) join this group.

`src/proxy.ts` only refreshes the session. It does not query the
database or act as the security boundary. Protected layouts call
`getAuthIdentity()` / `requireAuth()`, which use `supabase.auth.getClaims()`.
Never authorize from `getSession()`.

## Flow

1. **Sign up** — `signUp()` with `full_name` in user metadata. If the
   project requires confirmation, the UI shows “Check your inbox”. If a
   session is returned immediately, redirect to `/home`.
2. **Confirm** — Confirm-signup email hits `/auth/confirm?token_hash=…&type=email`.
   `verifyOtp()` establishes the cookie session. Token query params are
   not forwarded. Success → `/home`. Failure → `/error`.
3. **Sign in** — `signInWithPassword()`. `?next=` is sanitized to an
   allow-listed internal path (default `/home`).
4. **Forgot password** — `resetPasswordForEmail()` with
   `redirectTo` → `/auth/callback?next=/reset-password`. The UI always
   shows a generic inbox message (no account enumeration).
5. **Callback** — `exchangeCodeForSession(code)`, then a safe `next`.
6. **Reset password** — `updateUser({ password })` only when
   `getClaims()` shows a session.
7. **Sign out** — server action `signOut()`, then `/sign-in`.
8. **Profile row** — migration `0002_auth_profile_provisioning.sql`
   inserts `public.profiles` on `auth.users` insert.

## Supabase Dashboard setup

These steps cannot be applied from the repo. Do them in the project
dashboard.

### 1. Authentication provider

Authentication → Providers → **Email** → enable Email / Password.

Do not enable Google, GitHub, Apple, or phone for Phase 1.

### 2. Email confirmation

Keep **Confirm email** enabled for production. Local testing may disable
it; the app handles both outcomes.

### 3. Site URL

- Development: `http://localhost:3000`
- Production: `https://<production-domain>`

Set the same value in `.env.local` as `NEXT_PUBLIC_SITE_URL`.

### 4. Redirect URLs

Add (adjust the production host when you have one):

```text
http://localhost:3000/auth/confirm
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/reset-password
http://localhost:3000/reset-password
http://localhost:3000/home
```

Do not use localhost as the production Site URL.

### 5. Confirm signup email template

Authentication → Email Templates → **Confirm signup**.

Replace the default confirmation URL with the SSR token-hash pattern:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

The dashboard change cannot be made from this repository.

### 6. Reset password email

The app sets `redirectTo` to `/auth/callback?next=/reset-password`.
Keep that URL in the allow list. Prefer the project’s PKCE / code
flow over exposing tokens in the page URL.

### 7. SMTP

The built-in Supabase email service is enough for development and is
rate-limited. Configure custom SMTP before meaningful production use.
This phase does not provision paid email.

### 8. Apply migrations

```bash
supabase db push
```

or run `0001_initial_schema.sql` then
`0002_auth_profile_provisioning.sql` in the SQL editor.

## Manual QA checklist

Requires a configured Supabase project. Automated E2E does **not**
cover these.

### Signup

- [ ] Valid signup → confirmation email (or session + `/home` if confirm is off)
- [ ] Duplicate signup → existing-account message or inbox state
- [ ] Invalid email rejected
- [ ] Password shorter than 8 characters rejected
- [ ] Mismatched confirm password rejected
- [ ] Confirmation link signs the user in and lands on `/home`

### Sign in

- [ ] Valid credentials → `/home` (or sanitized `next`)
- [ ] Wrong password → generic failure
- [ ] Unconfirmed email → “Please confirm your email…”

### Protection

- [ ] Anonymous `/home` → `/sign-in?next=/home`
- [ ] Authenticated `/home` renders
- [ ] Authenticated visit to `/sign-in` or `/sign-up` → `/home`

### Recovery

- [ ] Forgot password always shows the generic inbox state
- [ ] Reset email arrives
- [ ] Expired / reused link → friendly `/error` or expired reset screen
- [ ] Valid reset updates the password
- [ ] Sign in with the new password works

### Sign out

- [ ] Session destroyed
- [ ] `/home` is inaccessible afterward
