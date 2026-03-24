import { View, Text, Pressable, StyleSheet } from "react-native";
import AppCard from "@/components/ui/AppCard";
import { Colors } from "@/constants/colors";

export type SaveMode = "billTotals" | "lineItems";

type Props = {
  saveMode: SaveMode;
  onChangeMode: (mode: SaveMode) => void;
};

export default function SaveModeCard({ saveMode, onChangeMode }: Props) {
  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>Save Mode</Text>
      <Text style={styles.description}>
        Choose whether to save one expense per bill total or one expense per
        detected line item.
      </Text>

      <View style={styles.row}>
        <Pressable
          onPress={() => onChangeMode("billTotals")}
          style={[
            styles.button,
            saveMode === "billTotals" && styles.buttonActive,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              saveMode === "billTotals" && styles.buttonTextActive,
            ]}
          >
            Save Bill Totals
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onChangeMode("lineItems")}
          style={[
            styles.button,
            saveMode === "lineItems" && styles.buttonActive,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              saveMode === "lineItems" && styles.buttonTextActive,
            ]}
          >
            Save All Line Items
          </Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>
        {saveMode === "billTotals"
          ? "One expense will be created for each bill using the total amount."
          : "One expense will be created for each detected line item."}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.mutedText,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputSurface,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonTextActive: {
    color: "#fff",
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.mutedText,
  },
});