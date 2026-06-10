## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2025-02-12 - [Clear Filters Button on Empty States]
**Learning:** Adding a visible and actionable "Clear Filters" button to empty states (when search or filters yield no results) significantly reduces friction and helps users recover their default view quickly.
**Action:** When implementing search or filter empty states, always provide a 'Clear Filters' button to allow users to easily recover.
