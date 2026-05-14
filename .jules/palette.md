## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-14 - Aria-Label Override
**Learning:** Adding a static `aria-label` to a container element like a button completely overrides and hides any dynamic interior content (like vote counts or variants) from screen readers.
**Action:** When a button contains dynamic, stateful text components (like counts or statuses) alongside localized descriptions, always concatenate those dynamic values directly into the top-level `aria-label` string to ensure they remain accessible, maintaining the existing language localization.
