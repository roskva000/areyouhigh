## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-02 - Keyboard Accessible Tooltips via Synthetic Bubbling
**Learning:** In React, synthetic `onFocus` and `onBlur` events bubble up. This allows non-focusable wrapper components (like Tooltips) to effortlessly capture focus state from their interactive children (like buttons or inputs) without needing complex refs or Context.
**Action:** Attach `onFocus` and `onBlur` directly to tooltip or popover wrapper elements to natively support keyboard accessibility alongside hover events.
