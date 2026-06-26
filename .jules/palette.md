## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2025-02-26 - Keyboard Accessible Tooltips
**Learning:** Tooltips triggered only by `onMouseEnter`/`onMouseLeave` exclude keyboard users from crucial context (e.g., parameter explanations in settings). Relying on React's event bubbling to capture `onFocus`/`onBlur` on a wrapper element gracefully solves this without complex ref forwarding.
**Action:** Always pair hover state events (`onMouseEnter`/`onMouseLeave`) with focus state events (`onFocus`/`onBlur`) on interactive wrappers to ensure parity for keyboard navigation.
