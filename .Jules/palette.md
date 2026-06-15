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
