## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-24 - Form Accessibility & Focus Visibility
**Learning:** Custom form inputs (like those in the Experience Lobby) frequently omit `aria-label`s and `focus-visible` styles, breaking both screen reader compatibility and keyboard navigation.
**Action:** Always add explicit `aria-label` attributes to inputs without associated labels and ensure `focus-visible:ring-2` is applied for clear keyboard focus indicators.
