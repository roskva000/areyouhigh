## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2025-04-03 - Accessible Inputs
**Learning:** Found inputs (like manual comment entry and hex color picker text inputs) in `ExperienceLobby.jsx` lacked `aria-label` attributes. Screen reader users would hear these as generic text inputs without context.
**Action:** Always add `aria-label` to form inputs, especially standalone ones (without explicit `<label>` tags) that rely on placeholder text, to ensure accessibility for screen readers.
