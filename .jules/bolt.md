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

## 2024-06-05 - Array Filtering in React Renders
**Learning:** Found a performance bottleneck in `Gallery.jsx` where `group.items.some` and `group.title.toLowerCase()` were being called unnecessarily for every item in the `EXPERIENCES` array, even when the `activeCategory` didn't match. This caused lag when typing in the search input.
**Action:** When optimizing array filtering in JavaScript (especially within React renders), apply fast, simple conditions (like direct equality checks) using early returns to short-circuit the loop before executing expensive string operations like `.toLowerCase()` or `.includes()`. Also hoist invariant `.toLowerCase()` conversions outside the loop.