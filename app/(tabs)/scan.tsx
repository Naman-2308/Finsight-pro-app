import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";
import ScreenContainer from "@/components/ui/ScreenContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EmptyState from "@/components/ui/EmptyState";
import AppCard from "@/components/ui/AppCard";
import ScanHeader from "@/components/scan/ScanHeader";
import ReceiptSourceActions from "@/components/scan/ReceiptSourceActions";
import ImagePreviewCard from "@/components/scan/ImagePreviewCard";
import SaveModeCard from "@/components/scan/SaveModeCard";
import BillEditorCard from "@/components/scan/BillEditorCard";
import { useReceiptScan } from "@/hooks/use-receipt-scan";

export default function ScanScreen() {
  const {
    image,
    bills,
    saveMode,
    totalLineItems,
    loading,
    saving,
    rateLimitCountdown,
    pickImage,
    takePhoto,
    scanReceipt,
    saveExpenses,
    setSaveMode,
    updateBillField,
    updateItemField,
  } = useReceiptScan();

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <ScanHeader />

      <SectionHeader title="Choose Receipt Source" />
      <ReceiptSourceActions onPickImage={pickImage} onTakePhoto={takePhoto} />

      {image ? (
        <ImagePreviewCard
          image={image}
          loading={loading}
          onScan={rateLimitCountdown > 0 ? undefined : scanReceipt}
        />
      ) : (
        <EmptyState message="No receipt selected yet. Pick an image or capture a photo to begin scanning." />
      )}

      {/* Rate limit banner */}
      {rateLimitCountdown > 0 && (
        <View style={styles.rateLimitBanner}>
          <Text style={styles.rateLimitTitle}>⏳ AI scanner is busy</Text>
          <Text style={styles.rateLimitText}>
            Both AI models are currently rate-limited. You can retry in{" "}
            <Text style={styles.rateLimitCountdown}>{rateLimitCountdown}s</Text>.
          </Text>
        </View>
      )}

      {loading && (
        <AppCard style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Analyzing receipt with AI...</Text>
        </AppCard>
      )}

      {bills.length > 0 && (
        <>
          <SectionHeader title="Detected Bills" />
          <Text style={styles.helperText}>
            {bills.length} bill{bills.length > 1 ? "s" : ""} detected •{" "}
            {totalLineItems} line item{totalLineItems !== 1 ? "s" : ""} detected
          </Text>

          <SaveModeCard saveMode={saveMode} onChangeMode={setSaveMode} />

          {bills.map((bill, billIndex) => (
            <BillEditorCard
              key={billIndex}
              bill={bill}
              billIndex={billIndex}
              onChangeBillField={(field, value) =>
                updateBillField(billIndex, field, value)
              }
              onChangeItemField={(itemIndex, field, value) =>
                updateItemField(billIndex, itemIndex, field, value)
              }
            />
          ))}

          <PrimaryButton
            title={
              saving
                ? "Saving..."
                : saveMode === "billTotals"
                  ? "Save Bill Totals"
                  : "Save All Line Items"
            }
            onPress={saveExpenses}
            disabled={saving}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 25,
    paddingBottom: 40,
  },
  helperText: {
    fontSize: 13,
    color: Colors.mutedText,
    marginBottom: 12,
  },
  loadingCard: {
    marginBottom: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: Colors.mutedText,
    fontSize: 14,
  },
  rateLimitBanner: {
    backgroundColor: Colors.warningSurface,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  rateLimitTitle: {
    color: Colors.warningText,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  rateLimitText: {
    color: Colors.warningText,
    fontSize: 13,
    lineHeight: 18,
  },
  rateLimitCountdown: {
    fontWeight: "800",
    fontSize: 14,
  },
});
