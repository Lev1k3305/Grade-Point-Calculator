## 2026-06-09 - [Initialization of Empty Repo with UX Focus]

**Learning:** When starting with an empty repository, establishing a strong UX foundation (theme, accessibility, validation) is critical. Users appreciate a cohesive design system (e.g., Cyberpunk/DEDSEC) that aligns with their existing work.
**Action:** Always check the developer's portfolio or other projects for aesthetic cues to provide a "delightful" and personalized initial experience.

## 2026-06-10 - [Enhanced Live Feedback & Accessibility]

**Learning:** Live feedback loops and tactile transitions significantly enhance the "Cyberpunk" feel by making the interface feel responsive and alive. Using `aria-atomic` ensures this speed doesn't compromise accessibility for screen reader users by providing full context on each update.
**Action:** For high-interaction utility apps, prioritize live calculation and smooth transitions. Always pair live updates with `aria-atomic="true"` on live regions to maintain accessibility.

## 2026-06-13 - [Frictionless Numeric Input & Theme-Consistent Focus]

**Learning:** For numeric inputs in utility tools, 'select-on-focus' significantly reduces friction for repetitive calculations. Additionally, custom focus states (like glows) should reinforce the app's aesthetic while ensuring ':focus-visible' compliance for accessibility.
**Action:** Default to 'element.select()' on focus for numeric fields. Ensure ':focus-visible' is always explicitly styled when default outlines are suppressed.

## 2026-06-14 - [Clipboard Integration & Keyboard Shortcuts]

**Learning:** For small utility tools, reducing the "distance" between calculation and data use is a major UX win. Adding a copy button minimizes friction. Additionally, providing an 'Escape' key shortcut for resetting the state aligns with user expectations for desktop-like web utilities.
**Action:** Include 'Copy to Clipboard' for primary output fields and 'Escape' to reset for single-purpose calculation tools.

## 2026-06-15 - [Accessible Shortcuts & Robust State Restoration]

**Learning:** Visible keyboard shortcut hints should not be hidden from screen readers (`aria-hidden="true"`) as they provide valuable context for interaction. Additionally, when providing temporary feedback via ARIA attributes, robustly restoring the original state (or removing the attribute if it was absent) prevents stale or invalid accessibility metadata.
**Action:** Ensure shortcut hints are screen-reader accessible. Use a "save-and-restore" pattern for temporary attribute changes, handling the absence of the attribute explicitly.

## 2026-06-16 - [Refined Dynamic Feedback & Mobile Accessibility]

**Learning:** When adding qualitative feedback (like status labels), using CSS utility classes instead of inline styles is crucial for preventing state leakage. Additionally, 'inputmode="decimal"' is a low-effort, high-impact win for mobile users, providing a decimal-ready keyboard by default.
**Action:** Always prefer class-based state management for dynamic UI updates. Include 'inputmode' on all numeric inputs to optimize the mobile experience.

## 2026-06-17 - [Accessible Symbolic Results & Defensive Animations]

**Learning:** Symbolic results like "A+" are often read ambiguously by screen readers. Providing a human-readable string in 'aria-label' (e.g., "Grade: A plus") ensures clarity. Furthermore, when using the Web Animations API for micro-interactions, defensive feature checks are required to prevent breakage in limited JS environments like JSDOM.
**Action:** Use 'replace("+", " plus")' for symbolic grades in aria-labels. Always wrap 'element.animate' calls in 'if (element.animate)' checks to ensure testability and progressive enhancement.

## 2026-06-18 - [Thematic Real-time Progress & Contrast Compliance]

**Learning:** Incorporating a "Stability Bar" (progress bar) below numeric inputs provides immediate qualitative feedback that feels thematic in "Cyberpunk" designs. Additionally, maintaining a contrast ratio of at least 4.5:1 for all text (including "dim" or secondary text) is a non-negotiable accessibility requirement.
**Action:** Use a transitioning width bar to visualize numeric input magnitude. Ensure '--dim' or secondary text colors are at least #949498 on pure black backgrounds to meet WCAG AA standards.

## 2026-06-19 - [Progressive Goal-Oriented Feedback]

**Learning:** For threshold-based inputs (like scores), providing "Next Goal" hints in status messages (e.g., `[ +5 TO A ]`) gamifies the experience and offers actionable feedback. Using dynamic precision (e.g., `.toFixed(1)`) only when necessary keeps the UI clean while remaining accurate for decimal entries.
**Action:** Implement "Next Goal" hints for multi-tier threshold systems. Use a helper to determine the nearest upcoming threshold and display the delta clearly.

## 2026-06-20 - [Tactile Error Feedback & State-Gated Animations]

**Learning:** Providing tactile feedback (like a shake animation) both when an input transitions to an invalid state and when a user tries to interact with it while invalid (e.g., pressing 'Enter') creates a much stronger sense of boundary. Gating these animations with state checks (e.g., `wasInvalid`) prevents redundant visual noise during continuous invalid input.
**Action:** Use 'triggerShake' for invalid state entries and failed interactions. Always track the previous valid/invalid state to gate entry animations.

## 2026-06-21 - [Scoped Global Shortcuts & Hint Discoverability]

**Learning:** Global keyboard shortcuts (like 'C' for copy) must be gated by 'document.activeElement' to prevent collisions with text entry. Additionally, providing explicit shortcut hints in the UI (e.g., '[C] TO COPY') significantly improves feature discoverability for power users without cluttering the interface for others.
**Action:** Always check 'document.activeElement' against input fields before triggering single-key shortcuts. Pair new shortcuts with non-intrusive UI hints.

## 2026-07-05 - [Score Persistence & Thematic Visual Feedback]

**Learning:** Persisting core user input in `localStorage` prevents data loss on accidental reloads, which is essential for utility tools. Furthermore, using `getComputedStyle` to drive micro-animations (like the copy pulse) ensures visual consistency by dynamically matching the animation color to the current state-based theme (e.g., matching the grade's specific color).
**Action:** Use `localStorage` for state persistence in single-page utilities. Fetch current UI colors via `getComputedStyle` to ensure thematic micro-interactions.

## 2026-07-06 - [Rich Progress Context & Precision Discoverability]

**Learning:** Providing `aria-valuetext` on progress bars (e.g., "Score: 95%, Grade: A plus") significantly improves the context for screen reader users beyond simple percentages. Additionally, adding `step="any"` to numeric inputs and using `title` attributes for keyboard hints on interactive shortcuts balances precision with discoverability.
**Action:** Always set `aria-valuetext` for non-linear progress bars. Use `step="any"` for decimal-capable inputs and add `title` tooltips to reinforce keyboard shortcut hints.

## 2026-07-07 - [Informative Landmarks & Qualitative ARIA Context]

**Learning:** Visual threshold markers on progress bars provide critical landmarks for users aiming for specific tiers. Implementing these via a CSS pseudo-element (`::after`) with a `linear-gradient` keeps the HTML clean and doesn't interfere with the `transition` of the fill element. Additionally, appending the qualitative status (e.g., "EXCELLENT") in parentheses to the `aria-valuetext` provides a much richer, context-aware experience for screen reader users than numerical data alone.
**Action:** For multi-tier progress bars, use `linear-gradient` markers for visual milestones and include qualitative status descriptions in `aria-valuetext` to bridge the gap between quantitative data and human-meaningful results.
