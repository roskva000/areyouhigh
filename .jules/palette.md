## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2025-02-27 - [Experience Lobby Test Reliability]
**Learning:** The Experience Lobby relies on application state or data. Directly navigating to `/experience/:id` in automated tests can result in a blank page or a timeout while waiting for selectors like `role=tablist`. Navigating via the gallery and interacting with cards is more robust.
**Action:** When writing Playwright verification scripts for the Experience Lobby, navigate to `/gallery` and click an experience card (`.gallery-card`) to access the lobby reliably.
