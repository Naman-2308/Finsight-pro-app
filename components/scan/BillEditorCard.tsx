import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import AppCard from "@/components/ui/AppCard";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import ItemEditorCard, { type ScannedItem } from "@/components/scan/ItemEditorCard";

export type ScannedBill = {
  merchant?: string;
  title: string;
  totalAmount: number;
  category: string;
  date?: string;
  notes?: string;
  items?: ScannedItem[];
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
  bill: ScannedBill;
  billIndex: number;
  onChangeBillField: (field: keyof ScannedBill, value: any) => void;
  onChangeItemField: (
    itemIndex: number,
    field: keyof ScannedItem,
    value: any
  ) => void;
};

export default function BillEditorCard({
  bill,
  billIndex,
  onChangeBillField,
  onChangeItemField,
}: Props) {
  return (
    <AppCard style={styles.billCard}>
      <Text style={styles.billHeader}>Bill {billIndex + 1}</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Merchant</Text>
        <TextInput
          value={bill.merchant || ""}
          onChangeText={(value) => onChangeBillField("merchant", value)}
          placeholder="Merchant name"
          placeholderTextColor={Colors.mutedText}
          style={styles.input}
          {...darkInputProps}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={bill.title}
          onChangeText={(value) => onChangeBillField("title", value)}
          placeholder="Bill title"
          placeholderTextColor={Colors.mutedText}
          style={styles.input}
          {...darkInputProps}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          value={String(bill.totalAmount ?? "")}
          onChangeText={(value) =>
            onChangeBillField("totalAmount", Number(value) || 0)
          }
          placeholder="Total amount"
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
            const active = bill.category === option;
            return (
              <Pressable
                key={option}
                onPress={() => onChangeBillField("category", option)}
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

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          value={bill.date || ""}
          onChangeText={(value) => onChangeBillField("date", value)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.mutedText}
          style={styles.input}
          {...darkInputProps}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={bill.notes || ""}
          onChangeText={(value) => onChangeBillField("notes", value)}
          placeholder="Notes"
          placeholderTextColor={Colors.mutedText}
          multiline
          style={[styles.input, styles.notesInput]}
          {...darkInputProps}
        />
      </View>

      <View style={styles.itemsSection}>
        <Text style={styles.itemsTitle}>
          Line Items ({bill.items?.length || 0})
        </Text>

        {(bill.items || []).length === 0 ? (
          <Text style={styles.noItemsText}>
            No readable line items detected for this bill.
          </Text>
        ) : (
          (bill.items || []).map((item, itemIndex) => (
            <ItemEditorCard
              key={itemIndex}
              item={item}
              onChangeName={(value) =>
                onChangeItemField(itemIndex, "name", value)
              }
              onChangeAmount={(value) =>
                onChangeItemField(itemIndex, "amount", Number(value) || 0)
              }
              onChangeCategory={(value) =>
                onChangeItemField(itemIndex, "category", value)
              }
            />
          ))
        )}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  billCard: {
    marginBottom: 12,
  },
  billHeader: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
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
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
  itemsSection: {
    marginTop: 6,
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 13,
    color: Colors.mutedText,
  },
});