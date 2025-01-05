import { RedistributionEntry } from "./types";

export const initializeRedistributionHistory = () => {
  return new Map<string, RedistributionEntry[]>();
};

export const trackRedistribution = (
  redistributionHistory: Map<string, RedistributionEntry[]>,
  fromDebtId: string,
  toDebtId: string,
  amount: number,
  month: number
) => {
  const existingHistory = redistributionHistory.get(toDebtId) || [];
  existingHistory.push({
    fromDebtId,
    amount,
    month
  });
  redistributionHistory.set(toDebtId, existingHistory);
  
  console.log(`Tracked redistribution:`, {
    from: fromDebtId,
    to: toDebtId,
    amount,
    month
  });
};