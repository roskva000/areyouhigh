## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-06-28 - [Keyboard shortcuts for overlays]
**Learning:** Blocking overlays like BriefingOverlay often lack global keyboard event listeners (e.g., 'Enter' or 'Escape') and focus styles on their skip buttons, degrading accessibility and trapping keyboard users.
**Action:** Always provide keyboard skip shortcuts for blocking UI, add `focus-visible` styles to the skip action, and visually hint the shortcut using a `<kbd>` element.
