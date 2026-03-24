import { View, StyleSheet, Dimensions } from "react-native";
import { Ambient } from "@/constants/finsightTheme";

const { width: W } = Dimensions.get("window");

export default function AmbientBackground() {
  return (
    <View style={styles.root} pointerEvents="none">
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbLeft]} />
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
  orbTop: {
    top: -W * 0.15,
    right: -W * 0.1,
    width: W * 0.55,
    height: W * 0.55,
    backgroundColor: Ambient.teal,
  },
  orbLeft: {
    top: W * 0.35,
    left: -W * 0.2,
    width: W * 0.5,
    height: W * 0.5,
    backgroundColor: Ambient.blue,
  },
});
