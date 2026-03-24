import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/colors";
import { type Expense } from "@/services/expenseService";

interface Props {
  expenses: Expense[];
  refreshing: boolean;
  onRefresh: () => void;
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default function RecentExpensesList({
  expenses,
  refreshing,
  onRefresh,
}: Props) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => [pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </Text>
        </Pressable>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No recent expenses found. Add one to get started.
          </Text>
        </View>
      ) : (
        expenses.map((expense) => (
          <View key={expense._id} style={styles.expenseCard}>
            <View>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={styles.expenseMeta}>
                {expense.category} • {formatDate(expense.date)}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>
              {formatCurrency(expense.amount)}
            </Text>
          </View>
        ))
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  linkText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  linkPressed: {
    opacity: 0.85,
  },
  expenseCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  expenseTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  expenseMeta: {
    color: Colors.mutedText,
    fontSize: 13,
  },
  expenseAmount: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
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