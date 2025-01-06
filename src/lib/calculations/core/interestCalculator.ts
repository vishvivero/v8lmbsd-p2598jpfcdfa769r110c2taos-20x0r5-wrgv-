import { addMonths } from "date-fns";

export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  const monthlyRate = annualRate / 1200;
  return Number((balance * monthlyRate).toFixed(2));
};

export const calculateTotalInterest = (
  balance: number,
  monthlyPayment: number,
  annualRate: number,
  maxMonths: number = 1200
): number => {
  let totalInterest = 0;
  let remainingBalance = balance;
  const monthlyRate = annualRate / 1200;

  for (let month = 0; month < maxMonths && remainingBalance > 0.01; month++) {
    const monthlyInterest = calculateMonthlyInterest(remainingBalance, annualRate);
    totalInterest += monthlyInterest;

    if (monthlyPayment <= monthlyInterest) {
      return Infinity;
    }

    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - monthlyPayment);
  }

  return Number(totalInterest.toFixed(2));
};

export const calculatePayoffDate = (startDate: Date, monthsToPayoff: number): Date => {
  return addMonths(startDate, monthsToPayoff);
};