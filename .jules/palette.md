## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2024-05-25 - [Custom Form Inputs Need Explicit ARIA & Focus States]
**Learning:** Custom inputs like the hex color picker or text log entries without default styling often lack proper `aria-label`s and clear visual focus indicators, making them invisible to screen readers and difficult to navigate via keyboard.
**Action:** When adding or modifying custom form inputs (e.g., text inputs, hex color inputs), ensure they include explicit `aria-label` attributes for screen readers and `focus-visible:ring-2` (and optionally `focus-visible:ring-accent` if applicable) utility classes for proper keyboard focus visibility.
