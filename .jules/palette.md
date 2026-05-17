## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-05-17 - Complex Card Accessibility Overrides
**Learning:** When using large interactive container elements (like the `ExperienceCard` root `<button>`), placing a generic `aria-label` on the root completely masks all deeply nested dynamic text (such as like/variant counts) from screen readers. This is a common failure pattern when building complex custom cards.
**Action:** When building interactive card components, always ensure that the root `aria-label` dynamically concatenates all critical inner data (e.g., counters, statuses) using the appropriate localized strings to prevent data loss for assistive technologies.
