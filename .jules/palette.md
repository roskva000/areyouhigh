## 2024-05-24 - [ARIA label overrides inner text]
**Learning:** Adding an `aria-label` to a button completely overrides its inner text for screen readers. If a button contains an icon and dynamic text (like a 'like' count), the screen reader will only read the `aria-label` and the text will be hidden.
**Action:** When adding `aria-label`s to icon-only interactive elements that also contain dynamic visible data (like counts), you must incorporate the dynamic data directly into the `aria-label` string (e.g., `aria-label={"Like experience. Currently " + likes + " likes"}`).
## 2024-06-24 - Translate aria-label for Screen Readers
**Learning:** Hardcoded accessibility strings in another language (e.g., Turkish "deneyimini aç") can slip through translations, causing severe confusion for screen reader users when the label language doesn't match the primary application language.
**Action:** Always verify that hidden accessibility text is localized alongside visible UI text.
