## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-06-04 - [Custom form input accessibility]
**Learning:** Custom form inputs like hex color pickers often have their default focus outlines removed for aesthetics (`focus:outline-none`), rendering them invisible to keyboard users and lacking context for screen readers.
**Action:** When creating or styling custom form inputs, always ensure they include an explicit `aria-label` for screen readers and distinct `focus-visible` utility classes (e.g., `focus-visible:ring-2 focus-visible:ring-accent`) for proper keyboard focus visibility.
