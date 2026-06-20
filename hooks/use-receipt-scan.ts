import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/lib/api";
import { type SaveMode } from "@/components/scan/SaveModeCard";
import { type ScannedBill } from "@/components/scan/BillEditorCard";
import { type ScannedItem } from "@/components/scan/ItemEditorCard";

const RATE_LIMIT_COOLDOWN_S = 60; // seconds to wait after a 429

async function buildReceiptFormData(imageUri: string) {
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

export function useReceiptScan() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bills, setBills] = useState<ScannedBill[]>([]);
  const [saveMode, setSaveMode] = useState<SaveMode>("billTotals");
  const [isScanning, setIsScanning] = useState(false);

  // Countdown displayed when rate-limited (0 = not rate-limited)
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const scanningCooldownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (scanningCooldownTimeout.current) clearTimeout(scanningCooldownTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  const startRateLimitCountdown = useCallback((seconds: number) => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setRateLimitCountdown(seconds);

    countdownInterval.current = setInterval(() => {
      setRateLimitCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!);
          countdownInterval.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetScannedData = useCallback(() => {
    setBills([]);
    setSaveMode("billTotals");
  }, []);

  const requestMediaLibraryPermission = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow gallery access to pick receipt images.");
      return false;
    }
    return true;
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow camera access to capture receipt images.");
      return false;
    }
    return true;
  }, []);

  const pickImage = useCallback(async () => {
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
  }, [requestMediaLibraryPermission, resetScannedData]);

  const takePhoto = useCallback(async () => {
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
  }, [requestCameraPermission, resetScannedData]);

  const scanReceipt = useCallback(async () => {
    if (!image) {
      Alert.alert("Error", "Please select or capture an image first.");
      return;
    }

    if (isScanning || loading || rateLimitCountdown > 0) return;

    try {
      setIsScanning(true);
      setLoading(true);

      const formData = await buildReceiptFormData(image);

      const res = await api.post("/receipt/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const scannedBills = res?.data?.extracted?.bills || [];

      if (!scannedBills.length) {
        Alert.alert("Scan failed", "Please upload a correct receipt image.");
        setBills([]);
        return;
      }

      setBills(scannedBills);

      // Cooldown only on success — prevents rapid re-scans of the same image
      if (scanningCooldownTimeout.current) clearTimeout(scanningCooldownTimeout.current);
      scanningCooldownTimeout.current = setTimeout(() => {
        setIsScanning(false);
      }, 4000);
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Receipt scanning failed. Please try again.";

      if (statusCode === 429) {
        // Rate limited — start countdown, don't show generic alert
        startRateLimitCountdown(RATE_LIMIT_COOLDOWN_S);
      } else {
        Alert.alert("Scan failed", message);
      }

      setBills([]);
      setIsScanning(false);
    } finally {
      setLoading(false);
    }
  }, [image, isScanning, loading, rateLimitCountdown, startRateLimitCountdown]);

  const saveExpenses = useCallback(async () => {
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
        `${res.data?.message || "Expenses saved"}${createdCount ? ` (${createdCount} created)` : ""}`
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
  }, [bills, saveMode, saving]);

  const updateBillField = useCallback(
    <K extends keyof ScannedBill>(billIndex: number, field: K, value: ScannedBill[K]) => {
      setBills((prev) =>
        prev.map((bill, index) => (index === billIndex ? { ...bill, [field]: value } : bill))
      );
    },
    []
  );

  const updateItemField = useCallback(
    <K extends keyof ScannedItem>(
      billIndex: number,
      itemIndex: number,
      field: K,
      value: ScannedItem[K]
    ) => {
      setBills((prev) =>
        prev.map((bill, currentBillIndex) => {
          if (currentBillIndex !== billIndex) return bill;
          return {
            ...bill,
            items: (bill.items || []).map((item, currentItemIndex) =>
              currentItemIndex === itemIndex ? { ...item, [field]: value } : item
            ),
          };
        })
      );
    },
    []
  );

  const totalLineItems = useMemo(
    () => bills.reduce((sum, bill) => sum + (bill.items?.length || 0), 0),
    [bills]
  );

  return {
    image,
    setImage,
    bills,
    setBills,
    saveMode,
    setSaveMode,
    totalLineItems,
    loading,
    saving,
    rateLimitCountdown,
    pickImage,
    takePhoto,
    scanReceipt,
    saveExpenses,
    updateBillField,
    updateItemField,
  };
}
