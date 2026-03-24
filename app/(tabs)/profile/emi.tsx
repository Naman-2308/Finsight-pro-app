import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  createEmi,
  getEmis,
  deleteEmi,
  getEmiOverview,
  type Emi,
  type EmiOverview,
} from "@/services/expenseService";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import ScreenContainer from "@/components/ui/ScreenContainer";

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function EmiScreen() {
  const [title, setTitle] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [remainingMonths, setRemainingMonths] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const [emis, setEmis] = useState<Emi[]>([]);
  const [overview, setOverview] = useState<EmiOverview | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [emiList, emiOverview] = await Promise.all([
        getEmis(),
        getEmiOverview(),
      ]);

      setEmis(emiList);
      setOverview(emiOverview);
    } catch {
      setEmis([]);
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

  function resetForm() {
    setTitle("");
    setMonthlyAmount("");
    setRemainingMonths("");
    setInterestRate("");
  }

  async function handleAddEmi() {
    setSuccessMessage("");
    setErrorMessage("");

    if (!title.trim() || !monthlyAmount.trim() || !remainingMonths.trim()) {
      setErrorMessage(
        "Please fill title, monthly amount, and remaining months."
      );
      return;
    }

    const amountNum = Number(monthlyAmount);
    const monthsNum = Number(remainingMonths);
    const rateNum = interestRate.trim() ? Number(interestRate) : 0;

    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setErrorMessage("Please enter a valid monthly EMI amount.");
      return;
    }

    if (!Number.isFinite(monthsNum) || monthsNum <= 0) {
      setErrorMessage("Please enter valid remaining months.");
      return;
    }

    if (!Number.isFinite(rateNum) || rateNum < 0) {
      setErrorMessage("Please enter a valid interest rate.");
      return;
    }

    try {
      setSaving(true);

      await createEmi({
        title: title.trim(),
        monthlyAmount: amountNum,
        remainingMonths: monthsNum,
        interestRate: rateNum,
      });

      resetForm();
      setSuccessMessage("EMI added successfully.");
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add EMI.";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEmi(id: string) {
    try {
      setDeletingId(id);
      setSuccessMessage("");
      setErrorMessage("");

      await deleteEmi(id);

      setSuccessMessage("EMI deleted successfully.");
      await loadData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete EMI.";
      setErrorMessage(message);
    } finally {
      setDeletingId(null);
    }
  }

  function confirmDelete(id: string, emiTitle: string) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${emiTitle}"?`
      );
      if (confirmed) {
        handleDeleteEmi(id);
      }
      return;
    }

    Alert.alert("Delete EMI", `Delete "${emiTitle}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteEmi(id),
      },
    ]);
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>EMI Manager</Text>
      <Text style={styles.subtitle}>
        Add your monthly EMIs to measure repayment burden and improve AI advice.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add EMI</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Car Loan, Education Loan"
            placeholderTextColor={Colors.mutedText}
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monthly Amount</Text>
          <TextInput
            value={monthlyAmount}
            onChangeText={setMonthlyAmount}
            placeholder="Enter EMI amount"
            placeholderTextColor={Colors.mutedText}
            keyboardType="numeric"
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Remaining Months</Text>
          <TextInput
            value={remainingMonths}
            onChangeText={setRemainingMonths}
            placeholder="Enter remaining months"
            placeholderTextColor={Colors.mutedText}
            keyboardType="numeric"
            style={styles.input}
            {...darkInputProps}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Interest Rate (optional)</Text>
          <TextInput
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="e.g. 9.5"
            placeholderTextColor={Colors.mutedText}
            keyboardType="numeric"
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
          onPress={handleAddEmi}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Adding EMI..." : "Add EMI"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EMI Overview</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : overview ? (
          <View style={styles.card}>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Total Monthly EMI</Text>
              <Text style={styles.overviewValue}>
                {formatCurrency(overview.totalMonthlyEMI)}
              </Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Monthly Salary</Text>
              <Text style={styles.overviewValue}>
                {formatCurrency(overview.monthlySalary)}
              </Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>EMI Burden</Text>
              <Text style={styles.overviewValue}>
                {overview.emiBurdenPercentage}%
              </Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Risk Level</Text>
              <Text
                style={[
                  styles.overviewValue,
                  overview.riskLevel === "High" && styles.riskHigh,
                  overview.riskLevel === "Moderate" && styles.riskModerate,
                  overview.riskLevel === "Low" && styles.riskLow,
                ]}
              >
                {overview.riskLevel}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No EMI overview available yet. Add at least one EMI to see burden
              analysis.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your EMIs</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : emis.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No EMIs added yet. Start by adding your first EMI above.
            </Text>
          </View>
        ) : (
          emis.map((emi) => {
            const isDeleting = deletingId === emi._id;

            return (
              <View key={emi._id} style={styles.emiCard}>
                <View style={styles.emiInfo}>
                  <Text style={styles.emiTitle}>{emi.title}</Text>
                  <Text style={styles.emiMeta}>
                    {formatCurrency(emi.monthlyAmount)} / month
                  </Text>
                  <Text style={styles.emiMeta}>
                    {emi.remainingMonths} months remaining
                  </Text>
                  <Text style={styles.emiMeta}>
                    Interest Rate: {emi.interestRate ?? 0}%
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.deleteButton,
                    isDeleting && styles.buttonDisabled,
                  ]}
                  onPress={() => confirmDelete(emi._id, emi.title)}
                  disabled={isDeleting}
                >
                  <Text style={styles.deleteButtonText}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Text>
                </Pressable>
              </View>
            );
          })
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
  section: {
    marginTop: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
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
  riskHigh: {
    color: "#DC2626",
  },
  riskModerate: {
    color: "#D97706",
  },
  riskLow: {
    color: "#16A34A",
  },
  emiCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  emiInfo: {
    marginBottom: 12,
  },
  emiTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  emiMeta: {
    fontSize: 13,
    color: Colors.mutedText,
    marginBottom: 4,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
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