## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-24 - Custom Color Input Accessibility
**Learning:** Custom form inputs that lack native focus styles (like hex color text inputs) need explicit `aria-label` attributes and `focus-visible` styles to be accessible to screen reader and keyboard users.
**Action:** Always add `aria-label` and `focus-visible:ring-2` (and typically `focus-visible:ring-accent rounded`) to custom text inputs that override native focus outlines.
