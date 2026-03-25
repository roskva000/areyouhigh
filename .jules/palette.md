## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2025-03-25 - [Explicit ARIA State Attributes for Tabs]
**Learning:** When building custom interactive components like tabs in React using standard elements (e.g., `<button>` inside a `<div>`), sighted users understand the visual groupings, but screen readers lack the context of the relationships.
**Action:** Always implement explicit ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`) and state attributes (`aria-selected`, `aria-controls`) when designing custom tab structures. Ensure the interactive elements have visible focus states (`focus-visible:ring-2`, `focus-visible:z-10`) so keyboard navigation remains accessible.
