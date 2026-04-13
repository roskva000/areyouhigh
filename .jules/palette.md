## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-04-13 - Add Tablist ARIA roles to ExperienceLobby
**Learning:** For custom interactive components like tabs, screen readers do not recognize them if they only use styled divs and buttons. It's critical to add explicit `role="tablist"`, `role="tab"`, and `role="tabpanel"` attributes, along with state markers like `aria-selected` and `aria-controls`, so the semantic structure correctly conveys the interactive tab layout.
**Action:** Always add semantic ARIA tab roles (`tablist`, `tab`, `tabpanel`) when creating or modifying custom tab-like navigation components.
