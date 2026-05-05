## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-05 - Keyboard Focus in Custom Tooltips
**Learning:** Tooltips that rely purely on `onMouseEnter`/`onMouseLeave` are inaccessible to keyboard users, preventing them from understanding the function of icon-only interactive controls (like sliders or buttons).
**Action:** Always pair mouse hover events with `onFocus` and `onBlur` on the tooltip wrapper, taking advantage of React's focus event bubbling, and explicitly assign `role="tooltip"` to the rendered tooltip container.
