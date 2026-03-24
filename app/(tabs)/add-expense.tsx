import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import ScreenContainer from "@/components/ui/ScreenContainer";
import {
  createExpense,
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

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddExpenseScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);

  async function handleSaveExpense() {
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

      await createExpense({
        title: title.trim(),
        amount: numericAmount,
        category,
        date,
      });

      Alert.alert("Success", "Expense added successfully.");

      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate(getTodayDate());

      router.replace("/home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create expense";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>
          Create a new expense manually and save it to your account.
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
                  style={({ pressed }) => [
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                    pressed && styles.pressScale,
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
          style={({ pressed }) => [
            styles.button,
            loading && styles.buttonDisabled,
            pressed && styles.pressScale,
          ]}
          onPress={handleSaveExpense}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Expense"}
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
    color: "#E6EEFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#8FA2CC",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.62)",
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.24)",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 8,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E6EEFF",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.28)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#EAF1FF",
    backgroundColor: "rgba(15, 23, 42, 0.85)",
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.28)",
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: "#E6EEFF",
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
  pressScale: {
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});