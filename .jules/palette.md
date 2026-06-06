## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-06-06 - Clear Filters Button in Empty States
**Learning:** Users can get stuck in a "no results" state if they apply too many filters or a typo in search. Without a clear recovery action, they might assume the app is broken or have to manually delete characters from inputs.
**Action:** Always provide an explicit, single-click "Clear Filters" recovery button in empty states when active search queries or filters are applied.
