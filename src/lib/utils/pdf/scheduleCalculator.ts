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
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();
  const monthlyRate = debt.interest_rate / 1200;
  let redistributedAmount = 0;

  // Track which debts have been paid off and their released payments
  const redistributedSources = new Map<string, number>();

  for (let month = 1; month <= totalMonths && balance > 0; month++) {
    // Calculate this month's interest
    const interest = balance * monthlyRate;
    let actualPayment = monthlyPayment;
    
    // Calculate redistributed payments from earlier paid off debts
    const redistributedFrom: string[] = [];
    redistributedAmount = 0;

    // Check for redistributed payments from previously paid off debts
    paidOffDebtsMap.forEach(({ month: paidOffMonth, payment }, debtName) => {
      if (paidOffMonth < month && debtIndex > allDebts.findIndex(d => d.name === debtName)) {
        redistributedAmount += payment;
        redistributedFrom.push(debtName);
        redistributedSources.set(debtName, payment);
      }
    });
    
    console.log(`Month ${month} redistribution for ${debt.name}:`, {
      redistributedAmount,
      redistributedFrom,
      paidOffDebts: Array.from(paidOffDebtsMap.entries())
    });
    
    actualPayment += redistributedAmount;
    const principal = Math.min(actualPayment - interest, balance);
    balance = Math.max(0, balance - principal);

    // Check if this debt is being paid off this month
    const isPayingOff = balance <= 0.01;
    if (isPayingOff) {
      paidOffDebtsMap.set(debt.name, { 
        month, 
        payment: debt.minimum_payment 
      });
      console.log(`${debt.name} paid off in month ${month}, releasing ${debt.minimum_payment}`);
    }

    // Format the redistributed from information
    const redistributedFromText = redistributedFrom.length > 0 
      ? redistributedFrom.map(name => 
          `${name} (${formatCurrency(redistributedSources.get(name) || 0)})`
        ).join(', ') 
      : '-';

    schedule.push([
      formatDate(getNextMonth(currentDate, month - 1)),
      formatCurrency(actualPayment),
      formatCurrency(principal),
      formatCurrency(interest),
      formatCurrency(balance),
      isPayingOff ? formatCurrency(debt.minimum_payment) : '-',
      redistributedFromText
    ]);

    if (balance <= 0.01) break;
  }

  return schedule;
};