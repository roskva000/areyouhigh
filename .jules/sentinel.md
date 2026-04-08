## 2024-04-08 - XSS in React JSON-LD Scripts
**Vulnerability:** XSS vulnerability when directly embedding JSON inside a React `<script>` tag using `{JSON.stringify(data)}`.
**Learning:** React text nodes inside `<script>` tags are not auto-escaped for HTML. This allows `</script>` breakouts if the JSON contains malicious payload strings.
**Prevention:** Always use `dangerouslySetInnerHTML` with `JSON.stringify(data).replace(/</g, '\\u003c')` when injecting JSON-LD scripts in React to prevent breakouts.
