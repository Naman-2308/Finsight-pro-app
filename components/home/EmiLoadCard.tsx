import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { type EmiOverview } from "@/services/expenseService";
import { formatCurrencyINR } from "@/lib/formatters";

interface Props {
  emiOverview: EmiOverview | null;
}

export default function EmiLoadCard({ emiOverview }: Props) {
  if (!emiOverview) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          No EMI data found yet. Add EMIs from Profile → Manage EMI.
        </Text>
      </View>
    );
  }

  const emiAlert =
    emiOverview.riskLevel === "High"
      ? `EMI burden is high at ${emiOverview.emiBurdenPercentage}%.`
      : emiOverview.riskLevel === "Moderate"
      ? `EMI burden is moderate at ${emiOverview.emiBurdenPercentage}%.`
      : "";

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>Total Monthly EMI</Text>
        <Text style={styles.cardValue}>
          {formatCurrencyINR(emiOverview.totalMonthlyEMI)}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>EMI Burden</Text>
        <Text style={styles.cardValue}>{emiOverview.emiBurdenPercentage}%</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>Risk Level</Text>
        <Text
          style={[
            styles.cardValue,
            emiOverview.riskLevel === "High" && styles.riskHigh,
            emiOverview.riskLevel === "Moderate" && styles.riskModerate,
            emiOverview.riskLevel === "Low" && styles.riskLow,
          ]}
        >
          {emiOverview.riskLevel}
        </Text>
      </View>

      {emiAlert ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{emiAlert}</Text>
        </View>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            No significant EMI burden detected.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  cardLabel: {
    color: Colors.mutedText,
    fontSize: 14,
  },
  cardValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  riskHigh: {
    color: Colors.danger,
  },
  riskModerate: {
    color: Colors.warningText,
  },
  riskLow: {
    color: Colors.success,
  },
  warningBox: {
    marginTop: 10,
    backgroundColor: Colors.warningSurface,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: 12,
    padding: 12,
  },
  warningText: {
    color: Colors.warningText,
    fontSize: 13,
    lineHeight: 18,
  },
  successBox: {
    marginTop: 10,
    backgroundColor: Colors.successSurface,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: 12,
    padding: 12,
  },
  successText: {
    color: Colors.successText,
    fontSize: 13,
    lineHeight: 18,
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