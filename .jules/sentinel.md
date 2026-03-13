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

## 2024-05-24 - [XSS Vulnerability in JSON-LD Script Tags]
**Vulnerability:** Embedding raw `JSON.stringify` data directly inside a `<script type="application/ld+json">` tag allows for Cross-Site Scripting (XSS). If the JSON contains a string with `</script>`, it prematurely closes the script tag, allowing the attacker to inject their own executable script tags immediately following it.
**Learning:** Even within React (which normally escapes text), script tag contents are treated differently. The browser's HTML parser looks for `</script>` without understanding the JavaScript or JSON context inside.
**Prevention:** Always use `dangerouslySetInnerHTML` for JSON-LD script tags in React, and explicitly sanitize the JSON string by replacing all instances of `<` with its unicode equivalent `\u003c` (e.g., `JSON.stringify(data).replace(/</g, '\\u003c')`).
