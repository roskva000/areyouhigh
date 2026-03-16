## 2024-03-16 - Accessible Custom Interactive Elements
**Learning:** Custom interactive components like tabs and pill toggles often lack native semantic state attributes (`aria-selected`, `aria-pressed`) and visible keyboard focus, making them difficult for screen reader and keyboard users to navigate.
**Action:** Always implement explicit ARIA state attributes (`aria-selected` for tabs, `aria-pressed` for toggles) and use `focus-visible:ring-2 focus-visible:ring-accent focus-visible:z-10` on custom interactive elements to ensure clear focus states and semantic accuracy.
