import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  setupFinance,
  getFinanceOverview,
  type FinanceOverview,
} from "@/services/expenseService";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import ScreenContainer from "@/components/ui/ScreenContainer";

export default function FinanceScreen() {
  const [salary, setSalary] = useState("");
  const [budget, setBudget] = useState("");
  const [overview, setOverview] = useState<FinanceOverview | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await getFinanceOverview();
      setSalary(String(data.monthlySalary ?? ""));
      setBudget(String(data.monthlyBudget ?? ""));
      setOverview(data);
    } catch {
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function handleSave() {
    setSuccessMessage("");
    setErrorMessage("");

    if (!salary.trim() || !budget.trim()) {
      setErrorMessage("Please fill both salary and budget.");
      return;
    }

    const monthlySalary = Number(salary);
    const monthlyBudget = Number(budget);

    if (!Number.isFinite(monthlySalary) || monthlySalary < 0) {
      setErrorMessage("Please enter a valid monthly salary.");
      return;
    }

    if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0) {
      setErrorMessage("Please enter a valid monthly budget.");
      return;
    }

    try {
      setSaving(true);

      await setupFinance({
        monthlySalary,
        monthlyBudget,
      });

      const updatedOverview = await getFinanceOverview();
      setOverview(updatedOverview);

      setSuccessMessage("Finance setup saved successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save finance setup.";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Finance Setup</Text>
      <Text style={styles.subtitle}>
        Add your salary and monthly budget so insights and advice become more
        accurate.
      </Text>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monthly Salary</Text>
          <TextInput
            placeholder="Enter monthly salary"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            placeholderTextColor={Colors.mutedText}
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monthly Budget</Text>
          <TextInput
            placeholder="Enter monthly budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            placeholderTextColor={Colors.mutedText}
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Save Finance Setup"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.overviewSection}>
        <Text style={styles.overviewTitle}>Current Overview</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : overview ? (
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Monthly Salary</Text>
              <Text style={styles.overviewValue}>₹{overview.monthlySalary}</Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Monthly Budget</Text>
              <Text style={styles.overviewValue}>₹{overview.monthlyBudget}</Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Spent This Month</Text>
              <Text style={styles.overviewValue}>₹{overview.spentThisMonth}</Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Remaining Budget</Text>
              <Text style={styles.overviewValue}>₹{overview.remainingBudget}</Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Estimated Savings</Text>
              <Text style={styles.overviewValue}>₹{overview.estimatedSavings}</Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Budget Used</Text>
              <Text style={styles.overviewValue}>
                {overview.budgetUsedPercentage}%
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No finance setup found yet. Save salary and budget to create one.
            </Text>
          </View>
        )}
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
    fontSize: 14,
    lineHeight: 21,
    color: Colors.mutedText,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
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
  errorBox: {
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: Colors.errorText,
    fontSize: 14,
  },
  successBox: {
    backgroundColor: Colors.successSurface,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  successText: {
    color: Colors.successText,
    fontSize: 14,
  },
  overviewSection: {
    marginTop: 4,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  overviewCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.mutedText,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
  },
  emptyText: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: "center",
  },
});