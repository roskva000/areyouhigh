
## 2026-02-27 - Accessible Labels for Custom Controls
**Learning:** In highly stylized "lobby" or configuration interfaces, standard form labels are often omitted for visual aesthetics. This leaves screen reader users stranded when encountering inputs like range sliders.
**Action:** Always add `aria-label` to inputs that lack a visible `<label>` element. For range inputs, also consider adding `aria-valuetext` to provide a human-readable interpretation of the value (e.g., "50%" instead of just "0.5"), enhancing the non-visual experience.
