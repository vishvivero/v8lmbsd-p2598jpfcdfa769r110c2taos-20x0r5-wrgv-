import { addMonths } from "date-fns";

export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  const monthlyRate = annualRate / 1200;
  return Number((balance * monthlyRate).toFixed(2));
};

export const calculatePayoffDate = (startDate: Date, monthsToPayoff: number): Date => {
  return addMonths(startDate, monthsToPayoff);
};

export const calculateTotalInterest = (
  balance: number,
  annualRate: number,
  monthlyPayment: number
): number => {
  let remainingBalance = balance;
  let totalInterest = 0;
  const monthlyRate = annualRate / 1200;

  while (remainingBalance > 0.01) {
    const monthlyInterest = calculateMonthlyInterest(remainingBalance, annualRate);
    totalInterest += monthlyInterest;
    
    const principalPayment = Math.min(
      monthlyPayment - monthlyInterest,
      remainingBalance
    );
    remainingBalance -= principalPayment;
  }

  return Number(totalInterest.toFixed(2));
};