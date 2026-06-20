import { Pressable, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/radius";
import { Spacing } from "@/constants/spacing";

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
        styles.wrap,
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
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.button,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
  },
  disabled: {
    opacity: 0.55,
    shadowOpacity: 0.06,
    elevation: 2,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  gradient: {
    paddingVertical: Spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#0A0C10",       // dark text on bright emerald — max contrast
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
