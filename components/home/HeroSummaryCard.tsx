import { Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { formatCurrencyINR } from "@/lib/formatters";

interface Props {
  monthExpense: number;
  todayExpense: number;
  weekExpense: number;
}

export default function HeroSummaryCard({
  monthExpense,
  todayExpense,
  weekExpense,
}: Props) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["#0D1F17", "#0A2A1C", "#071A12"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        {/* Emerald glow accent — top right */}
        <View style={styles.glowOrb} />

        {/* Left emerald border accent */}
        <View style={styles.leftAccent} />

        <Text style={styles.heroLabel}>Monthly Spending</Text>
        <Text style={styles.heroAmount}>{formatCurrencyINR(monthExpense)}</Text>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TODAY</Text>
            <Text style={styles.statValue}>{formatCurrencyINR(todayExpense)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>THIS WEEK</Text>
            <Text style={styles.statValue}>{formatCurrencyINR(weekExpense)}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    borderRadius: 22,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  heroCard: {
    borderRadius: 22,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 214, 143, 0.20)",
  },
  glowOrb: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 999,
    backgroundColor: "rgba(0, 214, 143, 0.10)",
  },
  leftAccent: {
    position: "absolute",
    top: 22,
    left: 0,
    width: 3,
    height: 44,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  heroLabel: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 12,
  },
  heroAmount: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 214, 143, 0.15)",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(0, 214, 143, 0.15)",
    marginHorizontal: 16,
  },
  statLabel: {
    color: Colors.mutedText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  statValue: {
    color: "#F0F4FF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
