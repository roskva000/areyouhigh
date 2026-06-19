## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-06-19 - Actionable Empty States
**Learning:** Empty states without recovery actions leave users stranded in a dead-end, harming usability and accessibility.
**Action:** Always provide an actionable "Clear Filters" button to allow users to easily recover and restore the default view when implementing search or filter empty states.
