## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2026-04-14 - [Implement ARIA Tab Pattern]
**Learning:** When building custom tab components in React using generic elements (like `div` or `button`), explicit ARIA roles (`tablist`, `tab`, `tabpanel`) and states (`aria-selected`, `aria-controls`, `aria-labelledby`) must be manually wired, along with visible focus indicators for keyboard navigation.
**Action:** Always implement the complete WAI-ARIA tab pattern (roles, connected IDs, and focus-visible states) when creating custom tab interfaces rather than relying on native button semantics alone.
