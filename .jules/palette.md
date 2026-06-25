## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).

## 2025-06-25 - Glassmorphism Focus Visibility
**Learning:** The application heavily relies on transparent and backdrop-blur (`bg-black/50 backdrop-blur-md`) elements like the Navbar. Standard focus rings with offsets (`ring-offset`) look visually broken against glassmorphic backgrounds due to transparency rendering.
**Action:** For glassmorphic design systems, apply `focus-visible:ring-2 focus-visible:ring-accent` directly on rounded elements without offsets. This maintains the glass illusion while remaining fully accessible to keyboard users.
