## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2025-02-28 - Focus State Validation for Custom Color Pickers
**Learning:** Adding custom color inputs often results in missing visual focus rings if standard outline defaults are suppressed via utilities like `focus:outline-none`. This creates an invisible trap for keyboard users.
**Action:** Always pair `focus:outline-none` with explicit `focus-visible:ring-2 focus-visible:ring-accent` to restore semantic keyboard accessibility without impacting pointer users.
