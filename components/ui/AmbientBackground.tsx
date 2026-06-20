import { View, StyleSheet, Dimensions } from "react-native";
import { Ambient } from "@/constants/finsightTheme";

const { width: W } = Dimensions.get("window");

/**
 * Three soft ambient orbs rendered behind every screen:
 *  • Top-right  — brand teal
 *  • Mid-left   — primary indigo-blue
 *  • Bottom-right — violet depth
 */
export default function AmbientBackground() {
  return (
    <View style={styles.root} pointerEvents="none">
      <View style={[styles.orb, styles.orbTopRight]} />
      <View style={[styles.orb, styles.orbMidLeft]} />
      <View style={[styles.orb, styles.orbBottomRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbTopRight: {
    top: -W * 0.18,
    right: -W * 0.12,
    width: W * 0.60,
    height: W * 0.60,
    backgroundColor: Ambient.teal,
  },
  orbMidLeft: {
    top: W * 0.35,
    left: -W * 0.22,
    width: W * 0.55,
    height: W * 0.55,
    backgroundColor: Ambient.blue,
  },
  orbBottomRight: {
    bottom: -W * 0.08,
    right: -W * 0.15,
    width: W * 0.45,
    height: W * 0.45,
    backgroundColor: Ambient.violet,
  },
});
