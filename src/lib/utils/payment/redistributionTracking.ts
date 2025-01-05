import { DebtStatus } from "./types";

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

  // Calculate total redistribution amount (base + cascaded)
  const totalRedistribution = amount + cascadedAmount;

  console.log(`Tracking redistribution for ${toDebtId}:`, {
    fromDebt: fromDebtId,
    baseAmount: amount,
    cascadedAmount,
    totalRedistribution,
    month
  });

  // Add new redistribution entry
  results[toDebtId].redistributionHistory?.push({
    fromDebtId,
    amount: totalRedistribution,
    month
  });
};