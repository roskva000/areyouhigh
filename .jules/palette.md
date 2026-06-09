## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-06-09 - [Accessible Custom Color Inputs]
**Learning:** Text inputs inside specialized UI panels (like a custom hex color picker) can easily be overlooked for accessibility. Without an explicit `aria-label`, screen readers cannot interpret their purpose, and without `focus-visible` classes, keyboard users cannot track their focus.
**Action:** Always ensure that every `<input>`, even those integrated into custom UI components or accompanying visual color blocks, has a clear `aria-label` and distinct focus indicators (`focus-visible:ring-2 focus-visible:ring-accent`).
