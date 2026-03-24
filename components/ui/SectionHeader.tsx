import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface Props {
  title: string;
  rightSlot?: ReactNode;
}

export default function SectionHeader({ title, rightSlot }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titleBlock}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightSlot ? <View>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 8,
  },
  titleBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexShrink: 1,
  },
  accent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: Colors.accentTeal,
    marginRight: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
});