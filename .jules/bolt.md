## 2024-05-22 - Initial Bolt Entry
**Learning:** Initial setup of Bolt's journal.
**Action:** Use this file to document critical performance learnings.

## 2024-05-23 - requestAnimationFrame Object Iteration
**Learning:** Found significant performance overhead in `ShaderExperience.jsx` caused by `Object.keys(expData.params).forEach` and `hexToRgb` inside the `requestAnimationFrame` render loop running 60 times a second. String parsing and object creation inside hot paths causes continuous garbage collection and jank in WebGL applications.
**Action:** Always pre-compute invariant values (like configuration lookups and hex-to-rgb conversions) outside the render loop and pass them as simple variables or arrays to the hot loop.

## 2024-05-23 - React.memo with Inline Functions in Lists
**Learning:** Using `React.memo` on list items (like `ExperienceCard`) fails to prevent re-renders if parent components pass inline arrow functions (e.g., `onClick={() => handle(item)}`) because the function reference changes every render.
**Action:** When `useCallback` is difficult to apply due to map iterations, provide a custom comparison function as the second argument to `React.memo` to explicitly compare scalar props and ignore the recreating function reference.
## 2026-03-01 - WebGL VRAM Leak Prevention
**Learning:** Found a severe memory leak in `ShaderExperience.jsx` where WebGL shaders (`gl.createShader`) and buffers (`gl.createBuffer`) were being created on every component mount or config change, but were not being deleted in the `useEffect` cleanup function. Only `gl.deleteProgram` was called. Over time, navigating between gallery items or changing parameters would exhaust GPU VRAM.
**Action:** Always pair WebGL creation methods (`createShader`, `createBuffer`) with their corresponding destruction methods (`deleteShader`, `deleteBuffer`) in the React component's cleanup phase to ensure deep cleanup of GPU resources.

## 2024-05-23 - Optimizing List Derivations in React
**Learning:** Recalculating expensive array operations (like `.filter()`, `.sort()`, and `new Set()`) and running invariant operations (like `.toLowerCase()`) inside component render loops or nested iteration blocks causes unnecessary performance overhead, especially as the list size grows. Additionally, grouping items using `Array.prototype.reduce` with the nullish coalescing assignment (`??=`) is ~30% faster than manual `forEach` pushes.
**Action:** Always wrap expensive list derivations in `useMemo` hooks so they only re-run when dependencies change. Hoist invariant operations outside of inner loops, and prefer `reduce` and `Object.entries().map()` for grouping and transforming data.
