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

/** Soft ambient accents (used by AmbientBackground) */
export const Ambient = {
  teal: "rgba(45, 212, 191, 0.14)",
  blue: "rgba(59, 130, 246, 0.12)",
  indigo: "rgba(99, 102, 241, 0.1)",
} as const;
