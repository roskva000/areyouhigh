## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-04-30 - Focus Rings Need Proper Border Radius
**Learning:** When applying `focus-visible` ring utilities to elements with rounded corners (like icon buttons), the focus ring can appear squared off and disjointed if the element itself doesn't have an explicit `rounded-*` utility (like `rounded-md` or `rounded-full`) to guide the ring's shape.
**Action:** Always ensure interactive elements have a border-radius utility when adding focus rings so the accessibility indicator matches the element's visual shape.
