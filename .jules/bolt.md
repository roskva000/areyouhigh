## 2024-05-22 - Initial Bolt Entry
**Learning:** Initial setup of Bolt's journal.
**Action:** Use this file to document critical performance learnings.

## 2024-05-23 - requestAnimationFrame Object Iteration
**Learning:** Found significant performance overhead in `ShaderExperience.jsx` caused by `Object.keys(expData.params).forEach` and `hexToRgb` inside the `requestAnimationFrame` render loop running 60 times a second. String parsing and object creation inside hot paths causes continuous garbage collection and jank in WebGL applications.
**Action:** Always pre-compute invariant values (like configuration lookups and hex-to-rgb conversions) outside the render loop and pass them as simple variables or arrays to the hot loop.
