import { Debt } from "@/lib/types";
import { calculateMonthlyInterest } from "./interestCalculator";
import { addMonths } from "date-fns";

export interface AmortizationEntry {
  date: Date;
  startingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export const calculateAmortizationSchedule = (
  debt: Debt,
  monthlyPayment: number
): AmortizationEntry[] => {
  console.log('Calculating amortization schedule for:', {
    debtName: debt.name,
    initialBalance: debt.balance,
    monthlyPayment
  });

  const schedule: AmortizationEntry[] = [];
  let currentBalance = debt.balance;
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date)
    : new Date();

  while (currentBalance > 0.01 && schedule.length < 360) {
    const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
    const availableForPrincipal = Math.min(monthlyPayment, currentBalance + monthlyInterest);
    const principalPayment = availableForPrincipal - monthlyInterest;
    const endingBalance = Math.max(0, currentBalance - principalPayment);

    schedule.push({
      date: new Date(currentDate),
      startingBalance: currentBalance,
      payment: availableForPrincipal,
      principal: principalPayment,
      interest: monthlyInterest,
      endingBalance
    });

    currentBalance = endingBalance;
    currentDate = addMonths(currentDate, 1);

    if (currentBalance <= 0.01) break;
  }

  console.log('Amortization schedule calculated:', {
    debtName: debt.name,
    totalMonths: schedule.length,
    finalBalance: schedule[schedule.length - 1].endingBalance
  });

  return schedule;
};