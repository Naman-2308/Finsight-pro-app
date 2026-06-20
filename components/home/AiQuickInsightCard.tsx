import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import AppCard from "@/components/ui/AppCard";

interface Props {
  insight: string;
}

export default function AiQuickInsightCard({ insight }: Props) {
  return (
    <AppCard style={styles.card}>
      <Text style={styles.aiInsightText}>
        {insight ||
          "Add more finance data and expenses to generate smarter AI insights."}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  aiInsightText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
});
