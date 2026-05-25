## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-25 - Accessible Custom Inputs
**Learning:** Custom text inputs like hex color pickers or specific chat inputs often lack contextual ARIA labels and clear focus rings because they visually appear self-explanatory or are deeply embedded in custom UI components. This creates a barrier for screen reader and keyboard navigation users.
**Action:** Always verify that custom input elements have explicit `aria-label` attributes and implement clear `focus-visible:ring-2` utility classes to ensure keyboard focus visibility and accessibility.
