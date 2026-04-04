## 2024-04-04 - Missing Aria Labels on Action Inputs
**Learning:** In highly visual interfaces like the `ExperienceLobby`, custom controls (like color pickers or chat forms) often lack traditional text labels. While visual users rely on context or icons, screen reader users face 'unlabeled input' barriers.
**Action:** Always verify that every `<input>` and `<button>` element has either an associated `<label>` element or an explicit `aria-label` attribute, even if the visual context makes its purpose obvious.
