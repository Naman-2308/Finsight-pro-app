import { Platform, type TextInputProps } from "react-native";

/** Keeps the iOS keyboard chrome aligned with the Finsight dark theme */
export const darkInputProps: Partial<TextInputProps> =
  Platform.OS === "ios" ? { keyboardAppearance: "dark" } : {};
