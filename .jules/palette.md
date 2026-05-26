## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2025-05-20 - Add ARIA labels and focus visibility to custom form inputs
**Learning:** Custom inputs (like hex color inputs and conditional log inputs) in visually complex backgrounds often lack explicit `aria-label` attributes and keyboard focus visibility, causing accessibility barriers for screen reader users and keyboard navigators.
**Action:** Always verify that every custom form input, regardless of visual context, has an explicit `aria-label` and `focus-visible:ring-2` styling.
