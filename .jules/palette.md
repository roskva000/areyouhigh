## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-05-25 - [Overlay Focus Traps]
**Learning:** Transient full-screen overlays often lack visible focus states on their subtle exit actions (like text-only 'Skip' buttons), leaving keyboard users trapped and unable to see what element they are interacting with.
**Action:** Always provide explicit `focus-visible` styles on overlay actions, ensuring the focus ring maintains enough contrast against the overlay background for keyboard navigation.
