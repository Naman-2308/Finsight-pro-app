import { Pressable, Text, StyleSheet, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/finsightTheme";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={() => {
        if (!disabled && Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => undefined
          );
        }
        onPress();
      }}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  disabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});