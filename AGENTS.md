# 2bit Project Contract

- Existing Vue 3 / Vite / Pinia / vue-router portfolio. Keep this stack and the manual nginx deployment workflow. Do not introduce React, Sites hosting, a UI framework, or a motion dependency.
- Content lives in `src/data`; routes are `/`, `/me`, `/process`, and `/projects/:slug`.
- Motion work must preserve typography, the project grid, all layout tracks, breakpoints (especially 768px and 1024px), media fitting, labels, captions, and navigation positions.
- Reference: https://www.iakovlev.co/. Adapt its masked text and long decelerating media movement; do not copy its layout or content.
- Centralize motion tokens in `src/styles/motion.css`. Reveal easing: `cubic-bezier(0.32, 0.01, 0, 1)`. Use transform and opacity; never animate full-page filters or cover content with strips/gradient overlays.
- Text: mount/intersection -> masked 105% vertical offset and zero opacity -> resting position/opacity 1; 720ms transform, 400ms opacity; 35ms line stagger capped at 210ms. Resize/font changes must recalculate lines without replaying already visible text.
- Navigation text: state change -> 105% offset/opacity 0 -> resting position/opacity 1; enter 520ms, exit 180ms; stagger capped at 140ms. Use interruptible CSS transitions.
- Media: ready and visible -> 16px offset, scale 1.025, opacity 0 -> resting position, scale 1, opacity 1; 900ms transform, 480ms opacity. Reveal only once per mount; offscreen items have no long cumulative delay.
- Home preview: fine-pointer hover/focus -> ready media crossfade (240ms) and scale 1.035 -> 1 (900ms). Keep the previous ready preview while a requested asset loads. Hover must not navigate. Cancel pending leave when the next item is entered.
- Reduced motion: no movement, scaling, clipping animation, or stagger; immediate visibility or <=120ms opacity. All controls must remain usable.
- Preserve the home preloader readiness gate. Never preload whole project galleries or duplicate hidden video loaders; project 5 previously exhausted phone memory. No blanket permanent `will-change` on galleries. Pause inactive home preview videos without destroying their buffers.
- Verify the production build plus desktop/mobile entry, rapid hover changes, bio, process popup/caption, project navigation, and reduced-motion behavior. Keep QA scripts, screenshots, and downloaded reference source outside the repository.
