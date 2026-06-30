## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-06-30 - Added Focus States to Full-Screen Overlays
**Learning:** Hidden or animated overlays often omit focus states on interactable elements like skip buttons because they are initially invisible, breaking keyboard navigation.
**Action:** Always ensure that all interactive elements in custom full-screen components have visible focus rings (`focus-visible:ring`), even if they are meant to be transient or unobtrusive.
