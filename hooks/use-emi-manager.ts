import { useCallback, useState } from "react";
import {
  createEmi,
  deleteEmi,
  getEmiOverview,
  getEmis,
  type Emi,
  type EmiOverview,
} from "@/services/expenseService";

export function useEmiManager() {
  const [title, setTitle] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [remainingMonths, setRemainingMonths] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const [emis, setEmis] = useState<Emi[]>([]);
  const [overview, setOverview] = useState<EmiOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [emiList, emiOverview] = await Promise.all([getEmis(), getEmiOverview()]);
      setEmis(emiList);
      setOverview(emiOverview);
    } catch {
      setEmis([]);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setTitle("");
    setMonthlyAmount("");
    setRemainingMonths("");
    setInterestRate("");
  }, []);

  const addEmi = useCallback(async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!title.trim() || !monthlyAmount.trim() || !remainingMonths.trim()) {
      setErrorMessage("Please fill title, monthly amount, and remaining months.");
      return;
    }

    const amountNum = Number(monthlyAmount);
    const monthsNum = Number(remainingMonths);
    const rateNum = interestRate.trim() ? Number(interestRate) : 0;

    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setErrorMessage("Please enter a valid monthly EMI amount.");
      return;
    }
    if (!Number.isFinite(monthsNum) || monthsNum <= 0) {
      setErrorMessage("Please enter valid remaining months.");
      return;
    }
    if (!Number.isFinite(rateNum) || rateNum < 0) {
      setErrorMessage("Please enter a valid interest rate.");
      return;
    }

    try {
      setSaving(true);
      await createEmi({
        title: title.trim(),
        monthlyAmount: amountNum,
        remainingMonths: monthsNum,
        interestRate: rateNum,
      });
      resetForm();
      setSuccessMessage("EMI added successfully.");
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add EMI.";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  }, [interestRate, loadData, monthlyAmount, remainingMonths, resetForm, title]);

  const removeEmi = useCallback(
    async (id: string) => {
      try {
        setDeletingId(id);
        setSuccessMessage("");
        setErrorMessage("");
        await deleteEmi(id);
        setSuccessMessage("EMI deleted successfully.");
        await loadData();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete EMI.";
        setErrorMessage(message);
      } finally {
        setDeletingId(null);
      }
    },
    [loadData]
  );

  return {
    title,
    setTitle,
    monthlyAmount,
    setMonthlyAmount,
    remainingMonths,
    setRemainingMonths,
    interestRate,
    setInterestRate,
    emis,
    overview,
    loading,
    saving,
    deletingId,
    successMessage,
    errorMessage,
    loadData,
    addEmi,
    removeEmi,
  };
}

