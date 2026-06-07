## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-06-07 - [Custom inputs focus and accessibility]
**Learning:** Custom form inputs like text and hex color pickers often lack explicit labels and keyboard focus visibility out of the box, rendering them inaccessible to screen readers and keyboard users.
**Action:** When adding or modifying custom form inputs, always ensure they include explicit `aria-label` attributes and `focus-visible:ring-2` utility classes.
