import { Debt } from "@/lib/types";
import { PaymentRow } from "./types";
import { formatCurrency, formatDate, getNextMonth } from "./formatters";

export const generateMonthlySchedule = (
  debt: Debt,
  monthlyPayment: number,
  totalMonths: number,
  allDebts: Debt[],
  debtIndex: number,
  paidOffDebtsMap: Map<string, { month: number, payment: number }>
): string[][] => {
  const schedule: string[][] = [];
  let balance = debt.balance;
  let currentDate = new Date();
  const monthlyRate = debt.interest_rate / 1200;

  // Track redistributed payments for this debt
  let redistributedAmount = 0;

  for (let month = 1; month <= totalMonths && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let actualPayment = monthlyPayment;
    
    // Calculate redistributed payments from earlier paid off debts
    const redistributedFrom: string[] = [];
    paidOffDebtsMap.forEach(({ month: paidOffMonth, payment }, debtName) => {
      if (paidOffMonth < month && debtIndex > allDebts.findIndex(d => d.name === debtName)) {
        redistributedAmount += payment;
        redistributedFrom.push(debtName);
      }
    });
    
    actualPayment += redistributedAmount;
    const principal = Math.min(actualPayment - interest, balance);
    balance = Math.max(0, balance - principal);

    // Check if this debt is being paid off this month
    const isPayingOff = balance <= 0.01;
    if (isPayingOff) {
      paidOffDebtsMap.set(debt.name, { month, payment: debt.minimum_payment });
    }

    schedule.push([
      formatDate(getNextMonth(currentDate, month - 1)),
      formatCurrency(actualPayment),
      formatCurrency(principal),
      formatCurrency(interest),
      formatCurrency(balance),
      isPayingOff ? formatCurrency(debt.minimum_payment) : '-',
      redistributedFrom.length > 0 ? redistributedFrom.join(', ') : '-'
    ]);

    if (balance <= 0.01) break;
  }

  return schedule;
};