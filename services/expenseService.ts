import { api } from "@/lib/api";

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Travel"
  | "Other";

export interface CreateExpensePayload {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface UpdateExpensePayload {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseSummary {
  todayExpense: number;
  weekExpense: number;
  monthExpense: number;
  expenseCount: number;
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  year: number;
  month: number;
  label: string;
  total: number;
}

export interface ExpenseAnalytics {
  totalExpense: number;
  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
}

export interface AIAdviceResponse {
  advice: string;
}

export async function createExpense(payload: CreateExpensePayload) {
  const response = await api.post<Expense>("/expenses", payload);
  return response.data;
}

export async function getExpenses() {
  const response = await api.get<Expense[]>("/expenses");
  return response.data;
}

export async function getSummary() {
  const response = await api.get<ExpenseSummary>("/expenses/summary");
  return response.data;
}

export async function getAnalytics() {
  const response = await api.get<ExpenseAnalytics>("/expenses/analytics");
  return response.data;
}

export async function getAIAdvice() {
  const response = await api.get<AIAdviceResponse>("/ai/advice");
  return response.data;
}

export async function updateExpense(
  expenseId: string,
  payload: UpdateExpensePayload
) {
  const response = await api.put<Expense>(`/expenses/${expenseId}`, payload);
  return response.data;
}

export async function deleteExpense(expenseId: string) {
  const response = await api.delete<{ message: string }>(
    `/expenses/${expenseId}`
  );
  return response.data;
}
// =====================
// FINANCE
// =====================

export interface FinanceOverview {
  monthlySalary: number;
  monthlyBudget: number;
  spentThisMonth: number;
  remainingBudget: number;
  estimatedSavings: number;
  budgetUsedPercentage: number;
}

export async function setupFinance(payload: {
  monthlySalary: number;
  monthlyBudget: number;
}) {
  const res = await api.post("/finance/setup", payload);
  return res.data;
}

export async function getFinanceOverview() {
  const res = await api.get<FinanceOverview>("/finance/overview");
  return res.data;
}

// =====================
// EMI
// =====================

export interface Emi {
  _id: string;
  title: string;
  monthlyAmount: number;
  remainingMonths: number;
  interestRate?: number;
}

export interface EmiOverview {
  totalMonthlyEMI: number;
  monthlySalary: number;
  emiBurdenPercentage: number;
  riskLevel: string;
}

export async function createEmi(payload: {
  title: string;
  monthlyAmount: number;
  remainingMonths: number;
  interestRate?: number;
}) {
  const res = await api.post("/emi", payload);
  return res.data;
}

export async function getEmis() {
  const res = await api.get<Emi[]>("/emi");
  return res.data;
}

export async function deleteEmi(id: string) {
  const res = await api.delete(`/emi/${id}`);
  return res.data;
}

export async function getEmiOverview() {
  const res = await api.get<EmiOverview>("/emi/overview");
  return res.data;
}