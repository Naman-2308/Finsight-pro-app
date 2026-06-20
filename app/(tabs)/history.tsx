import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import ScreenContainer from "@/components/ui/ScreenContainer";
import AppCard from "@/components/ui/AppCard";
import EmptyState from "@/components/ui/EmptyState";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/radius";
import { Spacing } from "@/constants/spacing";
import { deleteExpense, getExpenses, type Expense, type ExpenseCategory } from "@/services/expenseService";
import { confirmDestructive } from "@/lib/confirm";
import { formatCurrencyINR, formatDateShort, toInputDate } from "@/lib/formatters";

const ALL_CATEGORIES: Array<"All" | ExpenseCategory> = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

export default function HistoryScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<"All" | ExpenseCategory>("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const loadExpenses = useCallback(async (
    category?: string,
    start?: string,
    end?: string,
  ) => {
    try {
      setLoading(true);
      setError("");
      const data = await getExpenses({
        category: category && category !== "All" ? category : undefined,
        startDate: start || undefined,
        endDate: end || undefined,
      });
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
      loadExpenses(selectedCategory, startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadExpenses])
  );

  function applyFilters() {
    loadExpenses(selectedCategory, startDate, endDate);
  }

  function clearFilters() {
    setSelectedCategory("All");
    setStartDate("");
    setEndDate("");
    loadExpenses("All", "", "");
  }

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

  const hasActiveFilters = selectedCategory !== "All" || !!startDate || !!endDate;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Expense History</Text>
        <Text style={styles.subtitle}>Search, filter, and manage all your expenses.</Text>
      </View>

      {/* ── Filter Panel ── */}
      <AppCard style={styles.filterCard}>
        <Pressable
          style={styles.filterToggleRow}
          onPress={() => setFiltersExpanded((v) => !v)}
        >
          <Text style={styles.filterToggleLabel}>
            Filters{hasActiveFilters ? " ●" : ""}
          </Text>
          <Text style={styles.filterToggleChevron}>
            {filtersExpanded ? "▲" : "▼"}
          </Text>
        </Pressable>

        {filtersExpanded && (
          <View style={styles.filterBody}>
            {/* Category chips */}
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {ALL_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Date range */}
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>From</Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.mutedText}
                  style={styles.dateInput}
                />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>To</Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.mutedText}
                  style={styles.dateInput}
                />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.filterActions}>
              <Pressable
                onPress={applyFilters}
                style={({ pressed }) => [styles.applyButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
              {hasActiveFilters && (
                <Pressable
                  onPress={clearFilters}
                  style={({ pressed }) => [styles.clearButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </AppCard>

      {/* ── Expense List ── */}
      {loading ? (
        <AppCard style={styles.infoCard}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.infoText}>Loading expenses...</Text>
        </AppCard>
      ) : error ? (
        <AppCard style={styles.infoCard}>
          <Text style={styles.errorTitle}>Could not load expenses</Text>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton title="Retry" onPress={() => loadExpenses(selectedCategory, startDate, endDate)} />
        </AppCard>
      ) : expenses.length === 0 ? (
        <EmptyState
          message={
            hasActiveFilters
              ? "No expenses match your filters. Try adjusting the date range or category."
              : "No expenses found. Add one to start building your history."
          }
        />
      ) : (
        <>
          <SectionHeader
            title={`${expenses.length} expense${expenses.length !== 1 ? "s" : ""}${hasActiveFilters ? " (filtered)" : ""}`}
            rightSlot={
              <Pressable onPress={() => loadExpenses(selectedCategory, startDate, endDate)}>
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
    marginBottom: Spacing.md,
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

  // Filter panel
  filterCard: {
    marginBottom: Spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  filterToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  filterToggleLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  filterToggleChevron: {
    color: Colors.mutedText,
    fontSize: 11,
  },
  filterBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
  },
  filterLabel: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.mutedText,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.text,
    backgroundColor: Colors.inputSurface,
  },
  filterActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  clearButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  clearButtonText: {
    color: Colors.mutedText,
    fontSize: 13,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  // Expense list
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
