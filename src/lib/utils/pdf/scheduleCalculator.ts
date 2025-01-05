import { Debt } from "@/lib/types";
import { RedistributionEntry } from "../payment/types";
import { formatCurrency, formatDate } from "./formatters";
import { addMonths } from "date-fns";

export const generateMonthlySchedule = (
  debt: Debt,
  monthlyPayment: number,
  totalMonths: number,
  allDebts: Debt[],
  debtIndex: number,
  payoffDetails: { [key: string]: { redistributionHistory?: RedistributionEntry[] } }
): string[][] => {
  const schedule: string[][] = [];
  let balance = debt.balance;
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();
  const monthlyRate = debt.interest_rate / 1200;

  // Get redistribution history for this debt
  const redistributionHistory = payoffDetails[debt.id]?.redistributionHistory || [];

  for (let month = 1; month <= totalMonths && balance > 0; month++) {
    // Calculate this month's interest
    const interest = balance * monthlyRate;
    let actualPayment = monthlyPayment;
    
    // Find redistributions for this month
    const monthRedistributions = redistributionHistory.filter(r => r.month === month);
    const redistributedAmount = monthRedistributions.reduce((sum, r) => sum + r.amount, 0);
    
    // Format redistribution information
    const redistributedFromText = monthRedistributions.length > 0
      ? monthRedistributions.map(r => {
          const fromDebt = allDebts.find(d => d.id === r.fromDebtId);
          return `${fromDebt?.name || 'Unknown'} (${formatCurrency(r.amount)})`;
        }).join(', ')
      : '-';

    actualPayment += redistributedAmount;
    const principal = Math.min(actualPayment - interest, balance);
    balance = Math.max(0, balance - principal);

    // Check if this debt is being paid off this month
    const isPayingOff = balance <= 0.01;

    schedule.push([
      formatDate(currentDate),
      formatCurrency(actualPayment),
      formatCurrency(principal),
      formatCurrency(interest),
      formatCurrency(balance),
      isPayingOff ? formatCurrency(debt.minimum_payment) : '-',
      redistributedFromText
    ]);

    if (balance <= 0.01) break;
    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};