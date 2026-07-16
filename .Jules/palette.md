# Palette's Journal

## 2025-05-15 - Contextual Keyboard Shortcut Hints

**Learning:** Generic keyboard shortcut hints (e.g., "[C] TO COPY") can be made significantly more useful by making them contextual (e.g., "[C] COPY [A+]"). This provides immediate feedback on what _will_ happen, reducing cognitive load.
**Action:** Always look for opportunities to bake current state into action labels, especially for global shortcuts.

## 2025-05-15 - Transient State Integrity

**Learning:** Visual feedback for one-off actions (like "COPIED") becomes a liability if the underlying data changes while the feedback is still visible. It can lead users to believe they've copied data they haven't.
**Action:** Explicitly reset transient UI states (like success labels) in the primary validation/input handler of the component.

## 2025-05-15 - Predictive Ghost Previews

**Learning:** For actions that result in a quantifiable change to a progress indicator (like reaching a "Next Goal"), a "Ghost Preview" (a semi-transparent overlay showing the target state) significantly reduces cognitive load and provides immediate visual validation of the prospective action.
**Action:** When an action has a predictable effect on a gauge or progress bar, implement a hover/focus state that previews the result visually.

## 2025-07-16 - Dynamic Ghost Preview Coloring and Centralized Visual Triggers

**Learning:** A predictive "Ghost Preview" progress bar is far more effective and intuitive when its background color dynamically aligns with the qualitative tier of the target preview state (e.g., matching the yellow status of grades D/C, or the cyan/accent status of grades B/A/A+). Additionally, centralizing mouse/focus preview state changes into clean helper functions (such as `showGhost(goal)` and `hideGhost()`) prevents code duplication and ensures identical interactions for both dynamic elements and static keyboard shortcut elements.
**Action:** Always map predictive previews to the qualitative status colors of their target states, and centralize trigger logic to maintain visual consistency across all interaction points.
