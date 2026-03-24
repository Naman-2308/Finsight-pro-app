import { View, Text, StyleSheet, Pressable } from "react-native";
import { router, type Href } from "expo-router";
import { Colors } from "@/constants/colors";

export default function QuickActions() {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.quickActionsRow}>
        <Pressable
          style={styles.actionButtonPrimary}
          onPress={() => router.push("/add-expense" as Href)}
        >
          <Text style={styles.actionButtonPrimaryText}>Add Expense</Text>
        </Pressable>

        <Pressable
          style={styles.actionButtonSecondary}
          onPress={() => router.push("/scan" as Href)}
        >
          <Text style={styles.actionButtonSecondaryText}>Scan Receipt</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionButtonPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonSecondaryText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
});