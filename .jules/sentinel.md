# Sentinel Journal

## 2024-05-22 - [Setup]
**Status:** Initialized Sentinel journal.

## 2024-05-22 - [Missing Security Headers in Vercel Deployment]
**Vulnerability:** The application was deployed to Vercel without standard security headers like `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and `Referrer-Policy`. This made the app susceptible to clickjacking, MIME-type sniffing, and other web-based attacks.
**Learning:** Vercel does not inject these essential security headers by default. They must be explicitly configured in the deployment configuration file.
**Prevention:** Always verify and include a robust `headers` configuration block in `vercel.json` for all routes (`/(.*)`) to ensure fundamental HTTP security headers are enforced.

## 2024-05-23 - [Missing Rate Limiting & Silent Errors]
**Vulnerability:** Supabase API calls in `useComments.js` and `useVotes.js` lacked state locks (e.g., `isSubmitting`, `isVoting`), allowing potential API spam and race conditions. Furthermore, error objects from Supabase were silently ignored or logged to the console, exposing sensitive inner structures.
**Learning:** React hooks interacting with external APIs (like Supabase) must explicitly handle loading states to prevent rapid, duplicate submissions. Additionally, external library errors must be explicitly checked and thrown, then caught securely without exposing internal data structures to the client.
**Prevention:** Always implement `isSubmitting`/`isVoting` locks when writing interactive API hooks. Always wrap Supabase calls in `try/catch/finally` blocks, explicitly check for the `error` property in the response, and log securely in the `catch` block.
