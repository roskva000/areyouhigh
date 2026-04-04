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
## 2024-05-15 - [Information Exposure in Client Logs]
**Vulnerability:** Logging raw database error objects (from Supabase) to the browser console.
**Learning:** Supabase `error` objects can contain database constraints, table names, or internal state. Exposing them in client-side logs creates an information leakage risk.
**Prevention:** Always catch and sanitize API/Database errors before logging them in client-side code; fail securely with generic error messages.

## 2024-05-24 - [XSS via JSON-LD Direct Injection in React]
**Vulnerability:** The `jsonLd` stringified payload in `src/components/SEO.jsx` was directly injected into a `<script type="application/ld+json">` tag via standard React children interpolation (`{JSON.stringify(jsonLd)}`). Since React does not auto-escape the `<` character inside `<script>` elements, an attacker could potentially break out of the script tag using `</script>` embedded in user-controlled JSON-LD properties (e.g., descriptions or names), leading to a Cross-Site Scripting (XSS) vulnerability.
**Learning:** React's auto-escaping mechanism applies to standard HTML text nodes but is intentionally bypassed for `<script>` and `<style>` tag contents, allowing raw text injection. Therefore, stringifying arbitrary JSON inside a `<script>` tag is unsafe without manual escaping of potentially executable tags.
**Prevention:** Always use `dangerouslySetInnerHTML` for `<script>` tags injecting JSON data and sanitize the payload by explicitly replacing all `<` characters with their Unicode equivalent `\u003c` (e.g., `dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}`).
