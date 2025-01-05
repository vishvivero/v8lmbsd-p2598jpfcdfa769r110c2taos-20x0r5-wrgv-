import { RedistributionEntry, DebtStatus } from "./types";

export const trackRedistribution = (
  results: { [key: string]: DebtStatus },
  fromDebtId: string,
  toDebtId: string,
  amount: number,
  month: number,
  cascadedAmount: number = 0
) => {
  // Initialize redistributionHistory array if it doesn't exist
  if (!results[toDebtId].redistributionHistory) {
    results[toDebtId].redistributionHistory = [];
  }

  // Calculate total redistribution amount (current + cascaded)
  const totalAmount = amount + cascadedAmount;

  // Add new redistribution entry
  results[toDebtId].redistributionHistory?.push({
    fromDebtId,
    amount: totalAmount,
    month
  });
  
  console.log(`Tracked redistribution:`, {
    from: fromDebtId,
    to: toDebtId,
    originalAmount: amount,
    cascadedAmount,
    totalAmount,
    month,
    history: results[toDebtId].redistributionHistory
  });
};