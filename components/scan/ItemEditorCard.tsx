import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";

export type ScannedItem = {
  name: string;
  amount: number;
  category: string;
};

const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

type Props = {
  item: ScannedItem;
  onChangeName: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeCategory: (value: string) => void;
};

export default function ItemEditorCard({
  item,
  onChangeName,
  onChangeAmount,
  onChangeCategory,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          value={item.name}
          onChangeText={onChangeName}
          placeholder="Item name"
          placeholderTextColor={Colors.mutedText}
          style={styles.input}
          {...darkInputProps}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={String(item.amount ?? "")}
          onChangeText={onChangeAmount}
          placeholder="Item amount"
          placeholderTextColor={Colors.mutedText}
          keyboardType="numeric"
          style={styles.input}
          {...darkInputProps}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORY_OPTIONS.map((option) => {
            const active = item.category === option;
            return (
              <Pressable
                key={option}
                onPress={() => onChangeCategory(option)}
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "rgba(5, 10, 22, 0.72)",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.inputSurface,
  },
  categoryRow: {
    gap: 8,
    paddingRight: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
});