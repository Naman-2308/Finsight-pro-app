/** Spacing scale for consistent layout rhythm (px). */
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export type SpacingKey = keyof typeof Spacing;
