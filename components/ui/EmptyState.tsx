import { Text, StyleSheet } from "react-native";
import AppCard from "@/components/ui/AppCard";
import { Colors } from "@/constants/colors";

interface Props {
  message: string;
}

export default function EmptyState({ message }: Props) {
  return (
    <AppCard style={styles.card}>
      <Text style={styles.mark}>◇</Text>
      <Text style={styles.text}>{message}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    alignItems: "center",
    paddingVertical: 20,
  },
  mark: {
    color: "rgba(147, 197, 253, 0.45)",
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "300",
  },
  text: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
});