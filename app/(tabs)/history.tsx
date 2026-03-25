import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/colors";
import ScreenContainer from "@/components/ui/ScreenContainer";
import {
  getExpenses,
  deleteExpense,
  type Expense,
} from "@/services/expenseService";

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toInputDate(dateString: string) {
  return new Date(dateString).toISOString().slice(0, 10);
}

export default function HistoryScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load expenses";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

  async function handleDelete(expenseId: string) {
    try {
      setDeletingId(expenseId);
      await deleteExpense(expenseId);

      setExpenses((prev) => prev.filter((expense) => expense._id !== expenseId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete expense";
      Alert.alert("Delete failed", message);
    } finally {
      setDeletingId(null);
    }
  }

  function confirmDelete(expenseId: string, title: string) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${title}"?`
      );

      if (confirmed) {
        handleDelete(expenseId);
      }
      return;
    }

    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(expenseId),
        },
      ]
    );
  }

  function handleEdit(expense: Expense) {
    router.push({
      pathname: "/edit-expense/[id]" as any,
      params: {
        id: expense._id,
        title: expense.title,
        amount: String(expense.amount),
        category: expense.category,
        date: toInputDate(expense.date),
      },
    });
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense History</Text>
        <Text style={styles.subtitle}>
          View all your saved expenses in one place.
        </Text>
      </View>

      {loading ? (
        <View style={styles.infoCard}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.infoText}>Loading expenses...</Text>
        </View>
      ) : error ? (
        <View style={styles.infoCard}>
          <Text style={styles.errorTitle}>Could not load expenses</Text>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={loadExpenses}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.infoCard}>
          <Text style={styles.emptyTitle}>No expenses found</Text>
          <Text style={styles.emptyText}>
            Add an expense to start building your history.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.topRow}>
            <Text style={styles.countText}>
              Total Expenses: {expenses.length}
            </Text>

            <Pressable onPress={loadExpenses}>
              <Text style={styles.refreshText}>Refresh</Text>
            </Pressable>
          </View>

          {expenses.map((expense) => {
            const isDeleting = deletingId === expense._id;

            return (
              <View key={expense._id} style={styles.expenseCard}>
                <View style={styles.left}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.meta}>
                    {expense.category} • {formatDate(expense.date)}
                  </Text>
                </View>

                <View style={styles.right}>
                  <Text style={styles.amount}>
                    {formatCurrency(expense.amount)}
                  </Text>

                  <View style={styles.actionButtons}>
                    <Pressable
                      onPress={() => handleEdit(expense)}
                      style={({ pressed }) => [
                        styles.editButton,
                        pressed && styles.actionButtonPressed,
                      ]}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => confirmDelete(expense._id, expense.title)}
                      disabled={isDeleting}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        isDeleting && styles.deleteButtonDisabled,
                        pressed && !isDeleting && styles.actionButtonPressed,
                      ]}
                    >
                      <Text style={styles.deleteButtonText}>
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E6EEFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8FA2CC",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  countText: {
    color: "#D9E5FF",
    fontSize: 15,
    fontWeight: "700",
  },
  refreshText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  expenseCard: {
    backgroundColor: "rgba(15, 23, 42, 0.62)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.24)",
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.26,
    shadowRadius: 20,
    elevation: 7,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  right: {
    alignItems: "flex-end",
  },
  expenseTitle: {
    color: "#E8EEFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    color: "#8FA2CC",
    fontSize: 13,
  },
  amount: {
    color: "#DCE6FF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  deleteButtonDisabled: {
    opacity: 0.7,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  infoCard: {
    backgroundColor: "rgba(15, 23, 42, 0.62)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.24)",
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    color: "#9AA8C7",
    fontSize: 14,
  },
  emptyTitle: {
    color: "#E8EEFF",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: "#9AA8C7",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  errorTitle: {
    color: "#FEE2E2",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#FECACA",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});