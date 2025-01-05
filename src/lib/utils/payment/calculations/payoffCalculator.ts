import { addMonths } from "date-fns";
import { calculateMonthlyInterest } from "./interestCalculator";
import { Debt } from "@/lib/types";

export const calculateMonthsToPayoff = (
  balance: number,
  monthlyPayment: number,
  annualRate: number
): number => {
  if (monthlyPayment <= calculateMonthlyInterest(balance, annualRate)) {
    return Infinity;
  }

  let remainingBalance = balance;
  let months = 0;
  const monthlyRate = annualRate / 1200;

  while (remainingBalance > 0.01 && months < 1200) {
    const monthlyInterest = remainingBalance * monthlyRate;
    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - monthlyPayment);
    months++;
  }

  return months >= 1200 ? Infinity : months;
};

export const calculatePayoffDate = (months: number): Date => {
  return addMonths(new Date(), months);
};

export interface PayoffSummary {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  monthlyPayment: number;
}

export const calculatePayoffSummary = (
  debt: Debt,
  extraPayment: number = 0
): PayoffSummary => {
  const totalMonthlyPayment = debt.minimum_payment + extraPayment;
  const months = calculateMonthsToPayoff(debt.balance, totalMonthlyPayment, debt.interest_rate);
  
  return {
    months,
    totalInterest: calculateMonthlyInterest(debt.balance, debt.interest_rate) * months,
    payoffDate: calculatePayoffDate(months),
    monthlyPayment: totalMonthlyPayment
  };
};