import { Debt } from "@/lib/types";
import { RedistributionEntry, DebtStatus } from "./types/PaymentTypes";

export class RedistributionManager {
  private redistributions: Map<string, RedistributionEntry[]>;

  constructor() {
    this.redistributions = new Map();
  }

  trackRedistribution(
    fromDebtId: string,
    toDebtId: string,
    amount: number,
    month: number
  ) {
    const existingRedistributions = this.redistributions.get(toDebtId) || [];
    
    existingRedistributions.push({
      fromDebtId,
      amount,
      month
    });
    
    this.redistributions.set(toDebtId, existingRedistributions);
    
    console.log(`Tracked redistribution for month ${month}:`, {
      from: fromDebtId,
      to: toDebtId,
      amount,
      totalRedistributions: existingRedistributions.length
    });
  }

  getRedistributionsForDebt(debtId: string, month: number): number {
    const entries = this.redistributions.get(debtId) || [];
    return entries
      .filter(entry => entry.month <= month)
      .reduce((total, entry) => total + entry.amount, 0);
  }

  applyToResults(results: { [key: string]: DebtStatus }) {
    for (const [debtId, redistributions] of this.redistributions.entries()) {
      if (!results[debtId]) continue;
      results[debtId].redistributionHistory = [...redistributions];
    }
  }
}