## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-24 - [Missing loading states for async operations]
**Learning:** In fast-paced global chat or logging interfaces, users often double-click submit buttons if there isn't immediate visual feedback that their request is processing, leading to duplicate entries or frustrating cooldown errors.
**Action:** Always replace the default submit icon with a spinning loading indicator when the form's `isSubmitting` state is true to provide immediate, clear visual feedback that the async operation is in progress.
