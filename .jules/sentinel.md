# Sentinel Journal

## 2024-05-22 - [Setup]
**Status:** Initialized Sentinel journal.

## 2024-05-22 - [Missing Security Headers in Vercel Deployment]
**Vulnerability:** The application was deployed to Vercel without standard security headers like `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and `Referrer-Policy`. This made the app susceptible to clickjacking, MIME-type sniffing, and other web-based attacks.
**Learning:** Vercel does not inject these essential security headers by default. They must be explicitly configured in the deployment configuration file.
**Prevention:** Always verify and include a robust `headers` configuration block in `vercel.json` for all routes (`/(.*)`) to ensure fundamental HTTP security headers are enforced.

## 2026-03-02 - [API Spam and Race Conditions in Supabase Hooks]
**Vulnerability:** Supabase API calls in hooks (`useComments`, `useVotes`) lacked local state locks and explicit error checking, allowing users to spam the backend (API abuse/DoS) and trigger race conditions through rapid interaction.
**Learning:** Supabase's javascript client returns `{ data, error }` instead of throwing on failures like RLS rejections, so naive `try/catch` without checking `if (error)` fails silently. Local state locks (`isSubmitting`, `isVoting`) are necessary to prevent rapid repeated executions of API-bound functions.
**Prevention:** Always implement an `isSubmitting` flag in React hooks doing API calls. Always explicitly check `if (error) throw error` when using `supabase-js`, and ensure sensitive error details (like stack traces) are not leaked in the `catch` block.
