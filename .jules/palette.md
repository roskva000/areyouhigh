## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2026-04-16 - [Custom Tabs ARIA Requirements]
**Learning:** Custom tabs in React require full ARIA relationships (`tablist`, `tab`, `tabpanel`, `aria-controls`, `aria-labelledby`) and explicit `focus-visible` classes to satisfy keyboard navigation and screen reader requirements beyond standard button behavior.
**Action:** When creating custom tab components, ensure all associated container elements have the correct ARIA roles and relationships, and explicitly manage focus visibility.
