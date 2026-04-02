import { useCallback, useState } from "react";
import { getFinanceOverview, setupFinance, type FinanceOverview } from "@/services/expenseService";

export function useFinanceSetup() {
  const [salary, setSalary] = useState("");
  const [budget, setBudget] = useState("");
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const data = await getFinanceOverview();
      setSalary(String(data.monthlySalary ?? ""));
      setBudget(String(data.monthlyBudget ?? ""));
      setOverview(data);
    } catch {
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!salary.trim() || !budget.trim()) {
      setErrorMessage("Please fill both salary and budget.");
      return;
    }
    const monthlySalary = Number(salary);
    const monthlyBudget = Number(budget);
    if (!Number.isFinite(monthlySalary) || monthlySalary < 0) {
      setErrorMessage("Please enter a valid monthly salary.");
      return;
    }
    if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0) {
      setErrorMessage("Please enter a valid monthly budget.");
      return;
    }

    try {
      setSaving(true);
      await setupFinance({ monthlySalary, monthlyBudget });
      const updated = await getFinanceOverview();
      setOverview(updated);
      setSuccessMessage("Finance setup saved successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save finance setup.";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  }, [budget, salary]);

  return {
    salary,
    setSalary,
    budget,
    setBudget,
    overview,
    loading,
    saving,
    successMessage,
    errorMessage,
    loadData,
    save,
  };
}

