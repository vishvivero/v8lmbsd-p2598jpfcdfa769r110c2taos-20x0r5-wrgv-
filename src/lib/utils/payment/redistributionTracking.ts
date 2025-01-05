import { RedistributionEntry, DebtStatus } from "./types";

export const trackRedistribution = (
  results: { [key: string]: DebtStatus },
  fromDebtId: string,
  toDebtId: string,
  amount: number,
  month: number
) => {
  // Initialize redistributionHistory array if it doesn't exist
  if (!results[toDebtId].redistributionHistory) {
    results[toDebtId].redistributionHistory = [];
  }

  // Add new redistribution entry
  results[toDebtId].redistributionHistory?.push({
    fromDebtId,
    amount,
    month
  });
  
  console.log(`Tracked redistribution:`, {
    from: fromDebtId,
    to: toDebtId,
    amount,
    month,
    history: results[toDebtId].redistributionHistory
  });
};

// Remove unused function
// export const initializeRedistributionHistory = () => {
//   return new Map<string, RedistributionEntry[]>();
// };