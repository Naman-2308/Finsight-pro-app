import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { type EmiOverview } from "@/services/expenseService";

interface Props {
  emiOverview: EmiOverview | null;
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
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
          {formatCurrency(emiOverview.totalMonthlyEMI)}
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
        <View
          style={
            emiOverview.riskLevel === "Low"
              ? styles.successBox
              : styles.warningBox
          }
        >
          <Text
            style={
              emiOverview.riskLevel === "Low"
                ? styles.successText
                : styles.warningText
            }
          >
            {emiAlert}
          </Text>
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
    color: "#DC2626",
  },
  riskModerate: {
    color: "#D97706",
  },
  riskLow: {
    color: "#16A34A",
  },
  warningBox: {
    marginTop: 10,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 12,
    padding: 12,
  },
  warningText: {
    color: "#92400E",
    fontSize: 13,
    lineHeight: 18,
  },
  successBox: {
    marginTop: 10,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 12,
    padding: 12,
  },
  successText: {
    color: "#166534",
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