/**
 * Expo template theme — aligned with Finsight dark UI for ThemedView / ThemedText.
 */
import { Platform } from "react-native";

const bg = "#050A16";
const text = "#E6EEFF";
const tint = "#60A5FA";

export const Colors = {
  light: {
    text,
    background: bg,
    tint,
    icon: "#8FA2CC",
    tabIconDefault: "#64748B",
    tabIconSelected: tint,
  },
  dark: {
    text,
    background: bg,
    tint,
    icon: "#8FA2CC",
    tabIconDefault: "#64748B",
    tabIconSelected: tint,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
