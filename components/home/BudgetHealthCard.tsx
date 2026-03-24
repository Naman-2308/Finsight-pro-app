import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { type FinanceOverview } from "@/services/expenseService";

interface Props {
  finance: FinanceOverview | null;
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function BudgetHealthCard({ finance }: Props) {
  if (!finance) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          Finance setup not added yet. Go to Profile → Finance Setup to unlock
          budget-aware insights.
        </Text>
      </View>
    );
  }

  const budgetProgress = Math.max(
    0,
    Math.min(100, finance.budgetUsedPercentage || 0)
  );

  const budgetAlert =
    finance.budgetUsedPercentage >= 100
      ? "You have exceeded your monthly budget."
      : finance.budgetUsedPercentage >= 80
      ? `Warning: ${finance.budgetUsedPercentage}% of your budget is already used.`
      : "";

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>Monthly Budget</Text>
        <Text style={styles.cardValue}>
          {formatCurrency(finance.monthlyBudget)}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>Spent This Month</Text>
        <Text style={styles.cardValue}>
          {formatCurrency(finance.spentThisMonth)}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>Remaining Budget</Text>
        <Text style={styles.cardValue}>
          {formatCurrency(finance.remainingBudget)}
        </Text>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${budgetProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {finance.budgetUsedPercentage}% used
        </Text>
      </View>

      {budgetAlert ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{budgetAlert}</Text>
        </View>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Budget usage looks healthy right now.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  cardLabel: {
    color: Colors.mutedText,
    fontSize: 14,
  },
  cardValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  progressWrap: {
    marginTop: 10,
    marginBottom: 8,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  progressText: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
  warningBox: {
    marginTop: 10,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 12,
    padding: 12,
  },
  warningText: {
    color: "#92400E",
    fontSize: 13,
    lineHeight: 18,
  },
  successBox: {
    marginTop: 10,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 12,
    padding: 12,
  },
  successText: {
    color: "#166534",
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  emptyText: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
});