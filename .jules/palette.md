## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-24 - Enriched ARIA labels for dynamic interactive cards
**Learning:** When a button or interactive element contains an `aria-label`, it completely overrides the inner text for screen readers. In localized components, replacing inner dynamic content (like counts or categories) with a static `aria-label` causes data loss for native screen reader users.
**Action:** Always incorporate inner dynamic text (e.g., likes, variants, categories) directly into the `aria-label` string, preserving the component's existing language.
