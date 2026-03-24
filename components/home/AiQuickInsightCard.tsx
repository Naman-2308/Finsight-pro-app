import { Text, Pressable, StyleSheet } from "react-native";
import { router, type Href } from "expo-router";
import { Colors } from "@/constants/colors";
import AppCard from "@/components/ui/AppCard";
import SectionHeader from "@/components/ui/SectionHeader";

interface Props {
  insight: string;
}

export default function AiQuickInsightCard({ insight }: Props) {
  return (
    <>
      <SectionHeader
        title="AI Quick Insight"
        rightSlot={
          <Pressable onPress={() => router.push("/analytics" as Href)}>
            <Text style={styles.linkText}>Open Dashboard</Text>
          </Pressable>
        }
      />

      <AppCard style={styles.card}>
        <Text style={styles.aiInsightText}>
          {insight ||
            "Add more finance data and expenses to generate smarter AI insights."}
        </Text>
      </AppCard>
    </>
  );
}

const styles = StyleSheet.create({
  linkText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  card: {
    marginBottom: 16,
  },
  aiInsightText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
});