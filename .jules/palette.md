## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-20 - Enriched ARIA labels in localized components
**Learning:** When adding or enriching aria-labels on complex interactive elements (like cards) that contain dynamic text (like counts), the aria-label completely overrides the inner content for screen readers. Furthermore, these labels must preserve existing localizations (e.g., Turkish strings) to prevent accessibility regressions for native screen reader users.
**Action:** Always interpolate dynamic data into the aria-label directly and ensure any new descriptive text matches the existing language of the component.
