import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeHeader() {
  const timePhrase = getTimeGreeting();

  return (
    <View style={styles.header}>
      <LinearGradient
        colors={["rgba(37, 99, 235, 0.45)", "rgba(56, 189, 248, 0.22)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.greetingCard}
      >
        <Text style={styles.timeTag}>{timePhrase}</Text>
        <View style={styles.helloRow}>
          <Text style={styles.helloText}>Hello</Text>
          <Text style={styles.wave}>👋</Text>
        </View>
      </LinearGradient>

      <Text style={styles.title}>Your expense dashboard</Text>
      <Text style={styles.subtitle}>
        Track spending, budget, EMI load, and AI-driven insights.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
  },
  greetingCard: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(147, 197, 253, 0.35)",
  },
  timeTag: {
    color: "rgba(219, 234, 254, 0.92)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  helloRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  helloText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  wave: {
    fontSize: 22,
    marginLeft: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.4,
    textTransform: "capitalize",
  },
  subtitle: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
});
