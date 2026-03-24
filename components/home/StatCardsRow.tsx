import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

interface Props {
  todayExpense: number;
  expenseCount: number;
}

export default function StatCardsRow({
  todayExpense,
  expenseCount,
}: Props) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Today</Text>
        <Text style={styles.statValue}>{formatCurrency(todayExpense)}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Entries</Text>
        <Text style={styles.statValue}>{expenseCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  statLabel: {
    color: Colors.mutedText,
    fontSize: 12,
    marginBottom: 6,
  },
  statValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});