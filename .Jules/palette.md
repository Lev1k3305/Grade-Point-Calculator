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

## 2025-07-17 - Deferred Required Field Validation Style

**Learning:** Styling inputs on native `:invalid` when they are `required` causes a jarring, premature red/pink error border on initial page load when the input is empty. Additionally, displaying "required" errors while typing can feel aggressive.
**Action:** Bind invalid styles to `input[aria-invalid="true"]` instead of native `input:invalid`, and defer showing empty required field errors until the user actively clicks submit/Calculate or hits Enter. Automatically clear the error as soon as they type.
