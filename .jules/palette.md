## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-05-24 - Accessibility on Cinematic Overlays
**Learning:** Full-screen cinematic overlays (like BriefingOverlay) in this app often omit focus indicators and keyboard shortcuts to maintain aesthetics, but this traps keyboard users who can't visually see their focus to skip.
**Action:** Always pair visible keyboard focus rings (`focus-visible:ring`) and native key bindings (Esc/Space) with animated overlay skip actions to balance aesthetic immersion with accessibility.
