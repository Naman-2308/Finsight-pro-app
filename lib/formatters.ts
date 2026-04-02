export function formatCurrencyINR(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function formatDateShort(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toInputDate(dateString: string) {
  return new Date(dateString).toISOString().slice(0, 10);
}

