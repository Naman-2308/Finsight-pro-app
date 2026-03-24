import { Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";

interface Props {
  monthExpense: number;
  todayExpense: number;
  weekExpense: number;
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function HeroSummaryCard({
  monthExpense,
  todayExpense,
  weekExpense,
}: Props) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, "#3B82F6"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroLabel}>This Month</Text>
        <Text style={styles.heroAmount}>{formatCurrency(monthExpense)}</Text>
        <Text style={styles.heroSubtext}>
          Today: {formatCurrency(todayExpense)} • This Week:{" "}
          {formatCurrency(weekExpense)}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    borderRadius: 22,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  heroCard: {
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
  },
  heroLabel: {
    color: "#DBEAFE",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  heroAmount: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroSubtext: {
    color: "#DBEAFE",
    fontSize: 13,
    lineHeight: 18,
  },
});
