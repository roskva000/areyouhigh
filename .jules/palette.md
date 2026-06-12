## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-06-12 - Accessible Hex Color Inputs
**Learning:** Custom form inputs like hex color text fields must include explicit `aria-label`s for screen readers and `focus-visible` states to ensure proper keyboard navigation visibility.
**Action:** Always verify custom inputs have `aria-label` and `focus-visible:ring-2 focus-visible:ring-accent` utility classes applied.
