## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-06-22 - [Toggle buttons need aria-pressed]
**Learning:** When a button acts as a toggle (like a 'Like' or 'Dislike' button), changing its `aria-label` to describe the active state is not the correct accessibility pattern and can lead to confusing and inaccurate descriptions. The correct semantic approach is to use the `aria-pressed` attribute.
**Action:** Always use `aria-pressed={true/false}` on toggleable interactive elements to announce their state to screen readers instead of rewriting the `aria-label`.
