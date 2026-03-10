## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-05-18 - [Interactive Cards Missing Accessible Role]
**Learning:** Visual-heavy portal cards used a `div` with an `onClick` handler covering the card via absolute positioning, completely hiding them from keyboard navigation and screen readers.
**Action:** Converted the overlay `div` to a `<button>` element with `aria-label` and `focus-visible` styles to ensure full keyboard and screen reader accessibility while maintaining the design.
