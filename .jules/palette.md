## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-10 - Tooltip Keyboard Accessibility
**Learning:** In React, synthetic `onFocus` and `onBlur` events bubble up, meaning they can be attached to a non-focusable parent wrapper (like a Tooltip container) to effectively capture focus events from any interactive children without complex ref forwarding.
**Action:** When building custom accessible wrappers like Tooltips, attach `onFocus` and `onBlur` directly to the parent wrapper rather than attempting to clone elements or inject props.
