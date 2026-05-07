## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-07 - Dynamic Content in ARIA Labels
**Learning:** Applying an `aria-label` to a container (like a button) completely overrides the visibility of its inner text for screen readers. Dynamic data (like likes or item counts) inside the element becomes inaccessible.
**Action:** When an interactive element contains dynamic text or counts alongside icons, incorporate the dynamic text directly into the element's `aria-label` string (matching the component's localization).
