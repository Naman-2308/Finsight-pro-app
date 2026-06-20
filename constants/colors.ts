/**
 * Finsight — "Carbon Emerald" premium theme
 *
 * Palette logic:
 *   • Background: pure deep graphite — not blue, not black, just rich dark
 *   • Cards: SOLID surfaces so they pop off the background (no glass blur)
 *   • Primary: electric emerald green — #1 fintech trust/growth signal
 *   • Gold accent: amber for savings/wealth highlights
 *   • Blue accent: data/chart secondary
 */
export const Colors = {
  // ── Brand: Electric Emerald ───────────────────────────────────────────────
  primary:       "#00D68F",   // electric emerald — CTA, active elements
  primaryDark:   "#00A06A",   // deep emerald — shadows, gradient end
  primaryLight:  "#4DFFB8",   // bright mint — gradient start, highlights
  accentTeal:    "#00D68F",   // alias for primary (used by SectionHeader, HomeHeader)
  accentViolet:  "#F0B429",   // repurposed as amber gold — wealth/savings signals

  // ── Surfaces ─────────────────────────────────────────────────────────────
  background:    "#0A0C10",   // deep graphite — not near-black, not navy
  card:          "#121721",   // solid elevated surface — clearly visible
  cardElevated:  "#1B2235",   // modals, drawers — clearly higher layer
  inputSurface:  "#0E1119",   // sunken input bg — slightly darker than card

  // ── Text ─────────────────────────────────────────────────────────────────
  text:       "#F0F4FF",   // warm cool-white — crisp on graphite
  mutedText:  "#8B9EC4",   // blue-grey muted
  dimText:    "#4A5680",   // very muted hints / placeholders

  // ── Structure ────────────────────────────────────────────────────────────
  border:     "#1D2640",   // dark blue-tinted border — visible but subtle
  separator:  "#141B2E",   // divider between list items

  // ── Semantic ─────────────────────────────────────────────────────────────
  success:    "#00D68F",   // same as primary
  danger:     "#FF5C5C",   // bright red

  // Error
  errorSurface:    "rgba(255, 92, 92, 0.12)",
  errorBorder:     "rgba(255, 92, 92, 0.32)",
  errorTextStrong: "#FECDD3",
  errorText:       "#FDA4AF",

  // Success
  successSurface: "rgba(0, 214, 143, 0.12)",
  successBorder:  "rgba(0, 214, 143, 0.30)",
  successText:    "#A7F3D0",

  // Warning
  warningSurface: "rgba(240, 180, 41, 0.12)",
  warningBorder:  "rgba(240, 180, 41, 0.30)",
  warningText:    "#FDE68A",
} as const;
