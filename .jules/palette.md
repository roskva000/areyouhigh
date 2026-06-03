## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-03-20 - Hex Color Input Accessibility
**Learning:** Custom color inputs inside interactive components (like the Chromatic tab) often lack semantic labeling and visible focus states, rendering them inaccessible to screen readers and keyboard users.
**Action:** Always ensure custom text inputs functioning as color pickers have an explicit `aria-label` and utilize `focus-visible:ring-2` to guarantee keyboard accessibility and focus visibility.
