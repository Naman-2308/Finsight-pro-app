import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export default function ScanHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Receipt Scanner</Text>
      <Text style={styles.subtitle}>
        Capture a receipt with your camera or pick one from your gallery, then
        scan, review, edit, and save it.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.mutedText,
  },
});