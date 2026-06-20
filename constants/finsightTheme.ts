/** Motion & layout tokens for consistent Finsight polish */
export const Motion = {
  entranceMs: 440,
  staggerMs: 70,
} as const;

export const Radius = {
  card: 20,
  pill: 999,
  button: 16,
  tooltip: 8,
} as const;

/**
 * Ambient orb colours — three orbs tinting the background:
 *   top-right:    emerald (brand)
 *   mid-left:     sapphire (data/trust)
 *   bottom-right: gold (wealth)
 * Opacities kept low so they add depth without muddying the UI.
 */
export const Ambient = {
  teal:   "rgba(0,   214, 143, 0.13)",
  blue:   "rgba(79,  131, 241, 0.10)",
  violet: "rgba(240, 180,  41, 0.08)",
} as const;
