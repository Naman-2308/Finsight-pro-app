import { ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import AppCard from "@/components/ui/AppCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  cardStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

export default function TitledCardSection({
  title,
  subtitle,
  children,
  cardStyle,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.section, containerStyle]}>
      <View style={styles.headerRow}>
        <SectionHeader title={title} />
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <AppCard style={[styles.card, cardStyle]}>{children}</AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  headerRow: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginTop: -Spacing.xs,
    marginBottom: Spacing.sm,
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    padding: Spacing.sm,
  },
});

