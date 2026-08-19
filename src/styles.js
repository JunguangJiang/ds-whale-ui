// Styles for the whale dock row (above the composer) and the settings panel.
// Everything is scoped under the ds-whale-ui-* prefix. The row itself is
// pointer-events: none so it never blocks reading or the composer; only the
// whale glyph (and the hover chip it spawns) accepts the pointer.

const css = `
/* ---- dock row (conversation.input.dock entry, above the composer) ---- */

/* Rendered only while a turn is running or settling; idle renders nothing,
   so the band costs zero height when quiet. Mounting plays a rise-in and
   the .is-leaving stage collapses it back down before unmount. */
.ds-whale-ui-dock {
  position: relative;
  height: 36px;
  pointer-events: none;
  animation: ds-whale-rise 0.35s ease-out;
  /* Match the input card's horizontal geometry so the whale swims only
     within the composer box width, not the full viewport. */
  box-sizing: border-box;
  margin: 0 auto;
  max-width: var(--dsh-composer-card-max-width, 780px);
  width: calc(100% - 2 * var(--dsh-composer-side-clearance, 16px));
  /* Water surface: same background + border as the input card below,
     with rounded top corners and no bottom border — reads as a seamless
     extension of the composer card. The stack gap is negated via
     margin-bottom so there is no visual seam between dock and card. */
  background: var(--dsw-specific-input-major, #1a1f2e);
  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, rgba(255,255,255,0.06));
  border-bottom: none;
  border-radius: 22px 22px 0 0;
  margin-bottom: calc(-1 * var(--dsh-composer-stack-gap, 6px) - 1px);
  padding: 0 12px;
  overflow: hidden;
}
.ds-whale-ui-dock.is-leaving {
  overflow: hidden;
  animation: ds-whale-fall 0.3s ease-in forwards;
}
@keyframes ds-whale-rise {
  from { height: 0px; opacity: 0; }
  to { height: 36px; opacity: 1; }
}
@keyframes ds-whale-fall {
  from { height: 36px; opacity: 1; }
  to { height: 0px; opacity: 0; }
}

/* Waterline: a soft gradient at the very bottom of the surface — the
   boundary between the water surface and the card below. */
.ds-whale-ui-bar {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 1px;
  overflow: hidden;
  background: color-mix(in srgb, var(--ds-whale-color, #4d6bfe) 18%, transparent);
  border-radius: 0.5px;
}
.ds-whale-ui-bar-fill {
  position: absolute;
  inset: 0;
  width: 100%;
  background: linear-gradient(90deg,
    var(--ds-whale-color, #4d9de0), #9fd8ff, var(--ds-whale-color, #4d9de0));
  background-size: 200% 100%;
  opacity: 0.4;
  animation: ds-whale-shimmer 3.2s linear infinite;
}
.ds-whale-ui-dock.is-working .ds-whale-ui-bar-fill,
.ds-whale-ui-dock.is-finishing .ds-whale-ui-bar-fill {
  opacity: 0.95;
  animation: ds-whale-shimmer 1.4s linear infinite;
}
/* With a live plan (todos projection) the base fill dims to a track and the
   progress overlay lights the completed share of the waterline. */
.ds-whale-ui-dock.has-progress .ds-whale-ui-bar-fill {
  opacity: 0.18;
  animation: none;
}
.ds-whale-ui-bar-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg,
    var(--ds-whale-color, #4d9de0), #9fd8ff, var(--ds-whale-color, #4d9de0));
  background-size: 200% 100%;
  opacity: 0.95;
  border-radius: 1px;
  animation: ds-whale-shimmer 1.4s linear infinite;
  transition: width 0.6s ease;
}
@keyframes ds-whale-shimmer {
  from { background-position: 0% 0; }
  to { background-position: -200% 0; }
}

/* Progress lane: the whale patrols only the completed share of the row.
   Width follows todo progress (100% when no plan is published), so the
   whale's reach itself reads as the agent's progress. */
.ds-whale-ui-lane {
  position: absolute;
  left: 0;
  bottom: 4px;
  height: 28px;
  width: 100%;
  pointer-events: none;
  transition: width 0.6s ease;
}

/* Whale lane: the emoji swims left-right along the row. Both endpoints sit
   inside the band, so the whale is always fully visible even if the swim
   animation is somehow not running. */
.ds-whale-ui-whale {
  position: absolute;
  bottom: 0;
  left: 8px;
  width: 28px;
  height: 28px;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
  color: var(--ds-whale-color, #4d6bfe);
  filter: drop-shadow(0 2px 3px rgba(45, 70, 180, 0.35));
}
/* The brand whale svg (DeepSeek logo geometry, currentColor ink) sits on
   the waterline inside the 28px cell. */
.ds-whale-ui-logo {
  position: absolute;
  left: 1px;
  bottom: 4px;
  display: block;
}
/* Custom uploaded figure: contain-fit into the same waterline cell. */
.ds-whale-ui-logo.is-custom {
  width: 26px;
  height: 24px;
  bottom: 2px;
  object-fit: contain;
}
.ds-whale-ui-whale.swimming {
  animation: ds-whale-swim var(--ds-whale-speed, 7s) ease-in-out infinite alternate;
}
.ds-whale-ui-whale.paused,
.ds-whale-ui-whale.paused .ds-whale-ui-flip { animation-play-state: paused; }
@keyframes ds-whale-swim {
  from { left: 8px; }
  to { left: calc(100% - 36px); }
}

/* Direction: the emoji naturally faces left, so the rightward leg mirrors
   it. A step keyframe at twice the swim duration flips exactly at the
   turnaround of the alternate swim cycle - no mid-leg squashing. */
.ds-whale-ui-flip {
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  will-change: transform;
}
.ds-whale-ui-whale.swimming .ds-whale-ui-flip {
  animation: ds-whale-flip calc(var(--ds-whale-speed, 7s) * 2) linear infinite;
}
@keyframes ds-whale-flip {
  0%, 49.999% { transform: scaleX(-1); }
  50%, 100% { transform: scaleX(1); }
}

/* Vertical action rides the inner body, so pausing the swim freezes the
   whale where it stands while the emoji can still breach/dive/play. */
.ds-whale-ui-body {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform;
}
.ds-whale-ui-body.thinking {
  animation: ds-whale-bob 2.2s ease-in-out infinite;
}
.ds-whale-ui-body.working {
  animation: ds-whale-bob 1s ease-in-out infinite;
}
.ds-whale-ui-body.breaching {
  animation: ds-whale-breach 1.05s cubic-bezier(0.4, 0.05, 0.6, 0.95) forwards;
}
.ds-whale-ui-body.diving {
  animation: ds-whale-dive 0.85s ease-in forwards;
}
.ds-whale-ui-body.playful {
  animation: ds-whale-playful 0.9s ease-out;
}
@keyframes ds-whale-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes ds-whale-breach {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  35% { transform: translateY(-12px) rotate(-14deg); }
  65% { transform: translateY(-5px) rotate(12deg); }
  100% { transform: translateY(14px) rotate(0deg); opacity: 0; }
}
@keyframes ds-whale-dive {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(14px); opacity: 0; }
}
@keyframes ds-whale-playful {
  0% { transform: translateY(0); }
  40% { transform: translateY(-9px) rotate(-10deg); }
  100% { transform: translateY(0); }
}

/* Spout: three droplets rising off the blowhole while the model runs.
   They live inside the body, so they travel (and mirror) with the whale. */
.ds-whale-ui-spout {
  position: absolute;
  left: 50%;
  top: -1px;
  width: 0;
  height: 0;
  pointer-events: none;
}
.ds-whale-ui-spout i {
  position: absolute;
  bottom: 0;
  left: -1.5px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ds-whale-color, #4d9de0) 55%, #eaf6ff);
  opacity: 0;
  animation: ds-whale-drop 1.4s ease-out infinite;
}
.ds-whale-ui-spout i:nth-child(1) { animation-delay: 0s; --ds-whale-dx: -5px; }
.ds-whale-ui-spout i:nth-child(2) { animation-delay: 0.25s; --ds-whale-dx: 0px; }
.ds-whale-ui-spout i:nth-child(3) { animation-delay: 0.5s; --ds-whale-dx: 5px; }
@keyframes ds-whale-drop {
  0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
  15% { opacity: 0.95; }
  70% { opacity: 0.65; }
  100% { transform: translate(var(--ds-whale-dx, 0px), -13px) scale(1); opacity: 0; }
}

/* Wake bubbles trailing the whale while tools execute. */
.ds-whale-ui-bubbles { position: absolute; left: -7px; bottom: 1px; width: 0; height: 0; pointer-events: none; }
.ds-whale-ui-bubbles i {
  position: absolute;
  bottom: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid rgba(140, 195, 255, 0.85);
  animation: ds-whale-bubble 1.2s linear infinite;
}
.ds-whale-ui-bubbles i:nth-child(1) { left: 0; animation-delay: 0s; }
.ds-whale-ui-bubbles i:nth-child(2) { left: -7px; animation-delay: 0.4s; }
.ds-whale-ui-bubbles i:nth-child(3) { left: -14px; animation-delay: 0.8s; }
@keyframes ds-whale-bubble {
  from { transform: translate(0, 0); opacity: 0.9; }
  to { transform: translate(-10px, -12px); opacity: 0; }
}

/* Ambient bubbles drifting up off the waterline (full intensity only). */
.ds-whale-ui-ambient { position: absolute; inset: 0; pointer-events: none; }
.ds-whale-ui-ambient i {
  position: absolute;
  bottom: 3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--ds-whale-color, #4d9de0) 60%, transparent);
  opacity: 0;
  animation: ds-whale-ambient 3.6s linear infinite;
}
.ds-whale-ui-ambient i:nth-child(1) { left: 22%; animation-delay: 0.6s; }
.ds-whale-ui-ambient i:nth-child(2) { left: 68%; animation-delay: 2s; }
@keyframes ds-whale-ambient {
  0% { transform: translateY(0); opacity: 0; }
  12% { opacity: 0.5; }
  100% { transform: translateY(-16px); opacity: 0; }
}

/* Eco mode: whale parks near the left and gently bobs; no swim, no spout,
   no bubbles. This is the low-motion option, chosen in settings. */
.ds-whale-ui-dock.is-eco .ds-whale-ui-whale.swimming,
.ds-whale-ui-dock.is-eco .ds-whale-ui-flip {
  animation: none;
}
.ds-whale-ui-dock.is-eco .ds-whale-ui-spout,
.ds-whale-ui-dock.is-eco .ds-whale-ui-bubbles,
.ds-whale-ui-dock.is-eco .ds-whale-ui-ambient {
  display: none;
}
.ds-whale-ui-dock.is-eco .ds-whale-ui-body:not(.breaching):not(.diving):not(.playful) {
  animation: ds-whale-bob 2.6s ease-in-out infinite;
}

/* Inline clock: sits right before the chip, same subtle style. */
.ds-whale-ui-elapsed {
  position: absolute;
  right: 16px;
  bottom: 10px;
  font: 10px/1.2 system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  color: color-mix(in srgb, var(--ds-whale-color, #4d6bfe) 60%, currentColor);
  opacity: 0.7;
  pointer-events: none;
}

/* Chip: sits inline on the water surface (right-aligned), like a buoy.
   Part of the dock surface, not a floating tooltip — blends naturally. */
.ds-whale-ui-chip {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 3px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ds-whale-color, #4d6bfe) 10%, transparent);
  color: color-mix(in srgb, var(--ds-whale-color, #4d6bfe) 85%, currentColor);
  font: 11px/1.4 system-ui, sans-serif;
  white-space: nowrap;
  opacity: 0.9;
}
.ds-whale-ui-chip-time { font-variant-numeric: tabular-nums; opacity: 0.8; }

/* Replace the built-in "Deep diving..." turn-status line: it lives inside
   the conversation.view slot anchor and is the only status element there.
   The whale band above the composer takes over its position and semantics
   (role="status" + aria-live="polite" while active). */
[data-slot='conversation.view'] [role='status'][aria-live='polite'] {
  display: none;
}

/* ---- settings panel ---- */

.ds-whale-ui-settings {
  padding: 12px 4px;
  display: grid;
  gap: 14px;
  max-width: 440px;
  font-size: 13px;
}
.ds-whale-ui-settings .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.ds-whale-ui-settings input[type='checkbox'] {
  accent-color: var(--ds-whale-color, #4d9de0);
  width: 16px;
  height: 16px;
}
.ds-whale-ui-settings select {
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--ds-whale-color, #4d9de0) 45%, transparent);
  border-radius: 6px;
  padding: 4px 8px;
  color: inherit;
}
.ds-whale-ui-swatches { display: flex; gap: 8px; }
.ds-whale-ui-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
}
.ds-whale-ui-swatch.active { border-color: currentColor; }
.ds-whale-ui-logo-row { display: flex; align-items: center; gap: 10px; }
.ds-whale-ui-logo-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 30px;
  border: 1px dashed color-mix(in srgb, var(--ds-whale-color, #4d6bfe) 45%, transparent);
  border-radius: 6px;
  padding: 2px 6px;
}
.ds-whale-ui-logo-preview img { max-width: 26px; max-height: 24px; object-fit: contain; }
.ds-whale-ui-logo-default { font-size: 11px; opacity: 0.7; white-space: nowrap; }
.ds-whale-ui-logo-btn {
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--ds-whale-color, #4d6bfe) 45%, transparent);
  border-radius: 6px;
  padding: 4px 10px;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
}
.ds-whale-ui-logo-btn:hover {
  border-color: var(--ds-whale-color, #4d6bfe);
}
.ds-whale-ui-logo-error { color: #e06666; font-size: 12px; }
`

mod.css = css
