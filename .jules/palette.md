## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-11-20 - [ARIA label for Hex color input]
**Learning:** Text inputs used for displaying and editing hex color codes must be accessible to screen readers, which requires explicit `aria-label`s if visual labels aren't present.
**Action:** When creating text inputs tied to color pickers or visual color previews, always include an `aria-label` (e.g., `aria-label="Hex color value"`) to ensure the field's purpose is clear to assistive technologies.
