import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import ScreenContainer from "@/components/ui/ScreenContainer";
import AppCard from "@/components/ui/AppCard";
import EmptyState from "@/components/ui/EmptyState";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/radius";
import { Spacing } from "@/constants/spacing";
import { deleteExpense, getExpenses, type Expense } from "@/services/expenseService";
import { confirmDestructive } from "@/lib/confirm";
import { formatCurrencyINR, formatDateShort, toInputDate } from "@/lib/formatters";

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
      const message = err instanceof Error ? err.message : "Failed to load expenses";
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

  async function handleDelete(expense: Expense) {
    const ok = await confirmDestructive(
      "Delete Expense",
      `Are you sure you want to delete "${expense.title}"?`
    );
    if (!ok) return;

    try {
      setDeletingId(expense._id);
      await deleteExpense(expense._id);
      setExpenses((prev) => prev.filter((item) => item._id !== expense._id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete expense";
      Alert.alert("Delete failed", message);
    } finally {
      setDeletingId(null);
    }
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
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Expense History</Text>
        <Text style={styles.subtitle}>View all your saved expenses in one place.</Text>
      </View>

      {loading ? (
        <AppCard style={styles.infoCard}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.infoText}>Loading expenses...</Text>
        </AppCard>
      ) : error ? (
        <AppCard style={styles.infoCard}>
          <Text style={styles.errorTitle}>Could not load expenses</Text>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton title="Retry" onPress={loadExpenses} />
        </AppCard>
      ) : expenses.length === 0 ? (
        <EmptyState message="No expenses found. Add an expense to start building your history." />
      ) : (
        <>
          <SectionHeader
            title={`Total Expenses: ${expenses.length}`}
            rightSlot={
              <Pressable onPress={loadExpenses}>
                <Text style={styles.refreshText}>Refresh</Text>
              </Pressable>
            }
          />

          {expenses.map((expense) => {
            const isDeleting = deletingId === expense._id;
            return (
              <AppCard key={expense._id} style={styles.expenseCard}>
                <View style={styles.left}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.meta}>
                    {expense.category} • {formatDateShort(expense.date)}
                  </Text>
                </View>

                <View style={styles.right}>
                  <Text style={styles.amount}>{formatCurrencyINR(expense.amount)}</Text>
                  <View style={styles.actionButtons}>
                    <Pressable
                      onPress={() => handleEdit(expense)}
                      style={({ pressed }) => [styles.editButton, pressed && styles.actionButtonPressed]}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDelete(expense)}
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
              </AppCard>
            );
          })}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.mutedText,
  },
  refreshText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  expenseCard: {
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  right: {
    alignItems: "flex-end",
  },
  expenseTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    color: Colors.mutedText,
    fontSize: 13,
  },
  amount: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.tooltip,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.tooltip,
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
    alignItems: "center",
    gap: Spacing.xs,
  },
  infoText: {
    color: Colors.mutedText,
    fontSize: 14,
  },
  errorTitle: {
    color: Colors.errorTextStrong,
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: Colors.errorText,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
});

