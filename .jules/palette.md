## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-05-24 - [Custom form input accessibility]
**Learning:** Custom text inputs that lack associated native `<label>` elements are inaccessible to screen readers, and removing native browser outlines with `focus:outline-none` breaks keyboard navigation visibility.
**Action:** Always add explicit `aria-label` attributes to custom inputs without visible labels and apply `focus-visible:ring-2 focus-visible:ring-accent` utility classes to restore clear focus indicators.
