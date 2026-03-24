import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import ScreenContainer from "@/components/ui/ScreenContainer";
import {
  updateExpense,
  type ExpenseCategory,
} from "@/services/expenseService";

const CATEGORY_OPTIONS: ExpenseCategory[] = [
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

export default function EditExpenseScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title?: string;
    amount?: string;
    category?: ExpenseCategory;
    date?: string;
  }>();

  const expenseId = useMemo(() => String(params.id || ""), [params.id]);

  const [title, setTitle] = useState(String(params.title || ""));
  const [amount, setAmount] = useState(String(params.amount || ""));
  const [category, setCategory] = useState<ExpenseCategory>(
    (params.category as ExpenseCategory) || "Food"
  );
  const [date, setDate] = useState(String(params.date || ""));
  const [loading, setLoading] = useState(false);

  async function handleUpdateExpense() {
    if (!expenseId) {
      Alert.alert("Error", "Expense ID is missing.");
      return;
    }

    if (!title.trim() || !amount.trim() || !category || !date) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid expense amount.");
      return;
    }

    try {
      setLoading(true);

      await updateExpense(expenseId, {
        title: title.trim(),
        amount: numericAmount,
        category,
        date,
      });

      Alert.alert("Success", "Expense updated successfully.");
      router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update expense";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Edit Expense</Text>
      <Text style={styles.subtitle}>
        Update the expense details and save your changes.
      </Text>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Lunch, Uber, Electricity bill"
            placeholderTextColor={Colors.mutedText}
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor={Colors.mutedText}
            keyboardType="numeric"
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryWrap}>
            {CATEGORY_OPTIONS.map((item) => {
              const active = category === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="2026-03-20"
            placeholderTextColor={Colors.mutedText}
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdateExpense}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Update Expense"}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.mutedText,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.inputSurface,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});