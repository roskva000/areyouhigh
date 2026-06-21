## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-06-21 - [Dynamic Card Accessibility]
**Learning:** For interactive cards containing dynamic metadata (likes, variants), a static aria-label completely overrides the inner content for screen readers, hiding important context. A Turkish label on an English site is also detrimental.
**Action:** Always construct dynamic aria-labels for complex cards that summarize all vital visual data (title, category, counts) in a single, localized, screen-reader-friendly string.
