import { useCallback } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
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
import { useFinanceSetup } from "@/hooks/use-finance-setup";
import { formatCurrencyINR } from "@/lib/formatters";

export default function FinanceScreen() {
  const {
    salary,
    setSalary,
    budget,
    setBudget,
    overview,
    loading,
    saving,
    successMessage,
    errorMessage,
    loadData,
    save,
  } = useFinanceSetup();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Finance Setup</Text>
      <Text style={styles.subtitle}>
        Add your salary and monthly budget so insights and advice become more
        accurate.
      </Text>

      <AppCard style={styles.formCard}>
        <SectionHeader title="Monthly Inputs" />
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

        <InlineMessage type="error" message={errorMessage} />
        <InlineMessage type="success" message={successMessage} />

        <PrimaryButton
          title={saving ? "Saving..." : "Save Finance Setup"}
          onPress={save}
          disabled={saving}
        />
      </AppCard>

      <SectionHeader title="Current Overview" />
      {loading ? (
        <AppCard style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </AppCard>
      ) : overview ? (
        <AppCard>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Monthly Salary</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.monthlySalary)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Monthly Budget</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.monthlyBudget)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Spent This Month</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.spentThisMonth)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Remaining Budget</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.remainingBudget)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Estimated Savings</Text>
            <Text style={styles.overviewValue}>
              {formatCurrencyINR(overview.estimatedSavings)}
            </Text>
          </View>
          <View style={styles.overviewRowLast}>
            <Text style={styles.overviewLabel}>Budget Used</Text>
            <Text style={styles.overviewValue}>
              {overview.budgetUsedPercentage}%
            </Text>
          </View>
        </AppCard>
      ) : (
        <EmptyState message="No finance setup found yet. Save salary and budget to create one." />
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
  formCard: {
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
  loadingWrap: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
});

