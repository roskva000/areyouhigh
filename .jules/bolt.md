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
## 2026-03-05 - Deferred Values and UseMemo for Array Methods in React Renders
**Learning:** Performing filtering and sorting without `useMemo` on every render causes redundant array processing. During high-frequency state updates like typing in a search bar, `search.toLowerCase()` is evaluated repeatedly for each list item if not hoisted outside the `filter` loop. Additionally, synchronizing slow filtering processes directly with user input states causes the UI to freeze (main thread blocking).
**Action:** When filtering static arrays or performing complex string manipulations derived from state parameters, wrap the operations in a `useMemo` block. Hoist invariant calculations (like converting the search query to lowercase) outside the filter loop. Use `useDeferredValue` on text input states used for filtering to decouple input responsiveness from the filtering calculation, preventing typing lag. Apply early returns inside `filter` methods for fast checks (like category matching) to short-circuit expensive string operations.
