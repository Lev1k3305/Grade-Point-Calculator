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

## 2025-05-20 - Deferred Required Validation Feedback

**Learning:** Premature validation on empty required fields (like showing shaking animations, red borders, or "SYSTEM_ERROR: Score is required" immediately when the page loads or when a user is in the middle of clearing/typing) creates an aggressive and jarring user experience.
**Action:** Defer required field validation until the user explicitly attempts a submit action (clicking Calculate or pressing Enter), but clear the error immediately once they begin typing.

## 2025-05-25 - Predictive Ghost Preview Color Synchronization

**Learning:** When using visual predictive indicators like ghost progress bars, synchronizing their color with the specific target milestone grade (e.g., yellow for lower-tier passing grades C and D, cyan/accent for higher-tier grades B, A, A+) provides instant contextual cues that align directly with the user's focus and expectations.
**Action:** Always map predictive visual elements to the exact contextual design system colors of their target outcome.

## 2025-07-22 - Focus-conditional Keyboard Hints and Interactive Click Feedback

**Learning:** Teaching keyboard shortcuts natively inside form labels using focus-conditional (`:focus-within`) hints keeps the aesthetic minimal and clean, while helping keyboard power-users discover advanced controls. Additionally, tactile visual click feedback on primary buttons (such as `#btn`) bridges physical interaction and visual results.
**Action:** For keyboard-friendly forms, use `:focus-within` on the parent container to show keyboard hints in input labels, and apply standard pulse animations to primary trigger buttons.
