## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-06-13 - [Focus states on custom form inputs]
**Learning:** Custom inputs like hex color pickers or styled text inputs often lack semantic accessible names (`aria-label`) and visible keyboard focus states (`focus-visible:ring-2`), rendering them invisible to screen readers and difficult to navigate for keyboard users.
**Action:** When adding or modifying custom form inputs, always explicitly define `aria-label`s and append `focus-visible:ring-2 focus-visible:ring-accent` utility classes to ensure full visibility for both screen readers and keyboard navigation.
