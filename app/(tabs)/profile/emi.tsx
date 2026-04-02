import { useCallback } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import ScreenContainer from "@/components/ui/ScreenContainer";
import AppCard from "@/components/ui/AppCard";
import EmptyState from "@/components/ui/EmptyState";
import InlineMessage from "@/components/ui/InlineMessage";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/radius";
import { Spacing } from "@/constants/spacing";
import { darkInputProps } from "@/constants/inputProps";
import { useEmiManager } from "@/hooks/use-emi-manager";
import { formatCurrencyINR } from "@/lib/formatters";
import { confirmDestructive } from "@/lib/confirm";

function getRiskColor(riskLevel: string) {
  if (riskLevel === "High") return Colors.danger;
  if (riskLevel === "Moderate") return "#D97706";
  return Colors.success;
}

export default function EmiScreen() {
  const {
    title,
    setTitle,
    monthlyAmount,
    setMonthlyAmount,
    remainingMonths,
    setRemainingMonths,
    interestRate,
    setInterestRate,
    emis,
    overview,
    loading,
    saving,
    deletingId,
    successMessage,
    errorMessage,
    loadData,
    addEmi,
    removeEmi,
  } = useEmiManager();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function handleDelete(id: string, emiTitle: string) {
    const ok = await confirmDestructive(
      "Delete EMI",
      `Are you sure you want to delete "${emiTitle}"?`
    );
    if (ok) {
      await removeEmi(id);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>EMI Manager</Text>
      <Text style={styles.subtitle}>
        Add your monthly EMIs to measure repayment burden and improve AI advice.
      </Text>

      <AppCard style={styles.card}>
        <SectionHeader title="Add EMI" />

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

        <InlineMessage type="error" message={errorMessage} />
        <InlineMessage type="success" message={successMessage} />

        <PrimaryButton
          title={saving ? "Adding EMI..." : "Add EMI"}
          onPress={addEmi}
          disabled={saving}
        />
      </AppCard>

      <SectionHeader title="EMI Overview" />
      {loading ? (
        <AppCard style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </AppCard>
      ) : overview ? (
        <AppCard style={styles.card}>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Total Monthly EMI</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.totalMonthlyEMI)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Monthly Salary</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.monthlySalary)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>EMI Burden</Text>
            <Text style={styles.overviewValue}>{overview.emiBurdenPercentage}%</Text>
          </View>
          <View style={styles.overviewRowLast}>
            <Text style={styles.overviewLabel}>Risk Level</Text>
            <Text
              style={[styles.overviewValue, { color: getRiskColor(overview.riskLevel) }]}
            >
              {overview.riskLevel}
            </Text>
          </View>
        </AppCard>
      ) : (
        <EmptyState message="No EMI overview available yet. Add at least one EMI to see burden analysis." />
      )}

      <SectionHeader title="Your EMIs" />
      {loading ? (
        <AppCard style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </AppCard>
      ) : emis.length === 0 ? (
        <EmptyState message="No EMIs added yet. Start by adding your first EMI above." />
      ) : (
        emis.map((emi) => {
          const isDeleting = deletingId === emi._id;
          return (
            <AppCard key={emi._id} style={styles.emiCard}>
              <View style={styles.emiInfo}>
                <Text style={styles.emiTitle}>{emi.title}</Text>
                <Text style={styles.emiMeta}>
                  {formatCurrencyINR(emi.monthlyAmount)} / month
                </Text>
                <Text style={styles.emiMeta}>
                  {emi.remainingMonths} months remaining
                </Text>
                <Text style={styles.emiMeta}>
                  Interest Rate: {emi.interestRate ?? 0}%
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  isDeleting && styles.deleteButtonDisabled,
                  pressed && !isDeleting && styles.deleteButtonPressed,
                ]}
                onPress={() => handleDelete(emi._id, emi.title)}
                disabled={isDeleting}
              >
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>
            </AppCard>
          );
        })
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.mutedText,
    marginBottom: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.inputSurface,
  },
  loadingWrap: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  overviewRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.sm,
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
  emiCard: {
    marginBottom: Spacing.sm,
  },
  emiInfo: {
    marginBottom: Spacing.sm,
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
    backgroundColor: Colors.danger,
    borderRadius: Radius.input,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.7,
  },
  deleteButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

