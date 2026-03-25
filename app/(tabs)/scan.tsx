import { useState } from "react";
import { Text, StyleSheet, ActivityIndicator, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";
import ScreenContainer from "@/components/ui/ScreenContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EmptyState from "@/components/ui/EmptyState";
import AppCard from "@/components/ui/AppCard";
import ScanHeader from "@/components/scan/ScanHeader";
import ReceiptSourceActions from "@/components/scan/ReceiptSourceActions";
import ImagePreviewCard from "@/components/scan/ImagePreviewCard";
import SaveModeCard, { type SaveMode } from "@/components/scan/SaveModeCard";
import BillEditorCard, {
  type ScannedBill,
} from "@/components/scan/BillEditorCard";
import { type ScannedItem } from "@/components/scan/ItemEditorCard";

export default function ScanScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bills, setBills] = useState<ScannedBill[]>([]);
  const [saveMode, setSaveMode] = useState<SaveMode>("billTotals");
  const [isScanning, setIsScanning] = useState(false);

  function resetScannedData() {
    setBills([]);
    setSaveMode("billTotals");
  }

  async function requestMediaLibraryPermission() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow gallery access to pick receipt images."
      );
      return false;
    }

    return true;
  }

  async function requestCameraPermission() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow camera access to capture receipt images."
      );
      return false;
    }

    return true;
  }

  async function pickImage() {
    const granted = await requestMediaLibraryPermission();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      resetScannedData();
    }
  }

  async function takePhoto() {
    const granted = await requestCameraPermission();
    if (!granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      resetScannedData();
    }
  }

  async function buildFormData(imageUri: string) {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append("receipt", blob, "receipt.jpg");
    } else {
      formData.append("receipt", {
        uri: imageUri,
        name: "receipt.jpg",
        type: "image/jpeg",
      } as any);
    }

    return formData;
  }

  async function scanReceipt() {
    if (!image) {
      Alert.alert("Error", "Please select or capture an image first.");
      return;
    }

    if (isScanning || loading) return;

    try {
      setIsScanning(true);
      setLoading(true);

      const formData = await buildFormData(image);

      const res = await api.post("/receipt/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const scannedBills = res?.data?.extracted?.bills || [];

      if (!scannedBills.length) {
        Alert.alert("Scan failed", "Please upload a correct receipt image.");
        setBills([]);
        return;
      }

      setBills(scannedBills);
    } catch (err: any) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Receipt scanning failed. Please try again.";

      Alert.alert("Scan failed", message);

      setBills([]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        setIsScanning(false);
      }, 4000);
    }
  }

  async function saveExpenses() {
    if (!bills.length) {
      Alert.alert("Error", "No scanned bills to save.");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);

      const res = await api.post("/receipt/save", {
        mode: saveMode,
        bills,
      });

      const createdCount = res.data?.createdCount || 0;

      Alert.alert(
        "Success",
        `${res.data?.message || "Expenses saved"}${
          createdCount ? ` (${createdCount} created)` : ""
        }`
      );

      setBills([]);
      setImage(null);
      setSaveMode("billTotals");
    } catch (err: any) {
      const message = err?.message || "Save failed";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  }

  function updateBillField<K extends keyof ScannedBill>(
    billIndex: number,
    field: K,
    value: ScannedBill[K]
  ) {
    setBills((prev) =>
      prev.map((bill, index) =>
        index === billIndex ? { ...bill, [field]: value } : bill
      )
    );
  }

  function updateItemField<K extends keyof ScannedItem>(
    billIndex: number,
    itemIndex: number,
    field: K,
    value: ScannedItem[K]
  ) {
    setBills((prev) =>
      prev.map((bill, currentBillIndex) => {
        if (currentBillIndex !== billIndex) return bill;

        return {
          ...bill,
          items: (bill.items || []).map((item, currentItemIndex) =>
            currentItemIndex === itemIndex
              ? { ...item, [field]: value }
              : item
          ),
        };
      })
    );
  }

  const totalLineItems = bills.reduce(
    (sum, bill) => sum + (bill.items?.length || 0),
    0
  );

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
        <ScanHeader />

        <SectionHeader title="Choose Receipt Source" />
        <ReceiptSourceActions onPickImage={pickImage} onTakePhoto={takePhoto} />

        {image ? (
          <ImagePreviewCard
            image={image}
            loading={loading}
            onScan={scanReceipt}
          />
        ) : (
          <EmptyState message="No receipt selected yet. Pick an image or capture a photo to begin scanning." />
        )}

        {loading && (
          <AppCard style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Analyzing receipt...</Text>
          </AppCard>
        )}

        {bills.length > 0 && (
          <>
            <SectionHeader title="Detected Bills" />
            <Text style={styles.helperText}>
              {bills.length} bill{bills.length > 1 ? "s" : ""} detected •{" "}
              {totalLineItems} line item{totalLineItems !== 1 ? "s" : ""}{" "}
              detected
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
});