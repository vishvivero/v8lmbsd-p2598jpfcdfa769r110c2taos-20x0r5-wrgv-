import { Debt } from "@/lib/types";
import { RedistributionEvent } from "./types";

export const initializeRedistributionHistory = () => {
  return new Map<string, RedistributionEvent[]>();
};

export const trackRedistribution = (
  redistributionHistory: Map<string, RedistributionEvent[]>,
  fromDebt: Debt,
  toDebtId: string,
  amount: number,
  month: number
) => {
  const existingHistory = redistributionHistory.get(toDebtId) || [];
  existingHistory.push({
    month,
    amount,
    fromDebt: fromDebt.name
  });
  redistributionHistory.set(toDebtId, existingHistory);
  
  console.log(`Tracked redistribution:`, {
    from: fromDebt.name,
    to: toDebtId,
    amount,
    month
  });
};