import { Debt } from "@/lib/types";
import { Strategy } from "../strategies/debtStrategies";
import { calculateMonthlyInterest } from "../core/interestCalculator";
import { calculatePaymentAllocation } from "../core/paymentCalculator";

export interface PayoffDetails {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  redistributionHistory?: {
    fromDebtId: string;
    amount: number;
    month: number;
  }[];
}

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: { amount: number; payment_date: Date }[] = []
): { [key: string]: PayoffDetails } => {
  const results: { [key: string]: PayoffDetails } = {};
  const balances = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();

  // Initialize tracking
  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
    balances.set(debt.id, debt.balance);
  });

  // Sort one-time fundings by date
  const sortedFundings = [...oneTimeFundings].sort(
    (a, b) => a.payment_date.getTime() - b.payment_date.getTime()
  );
  let nextFundingIndex = 0;

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let currentMonthPayment = monthlyPayment;

    // Add any one-time fundings for this month
    while (
      nextFundingIndex < sortedFundings.length &&
      sortedFundings[nextFundingIndex].payment_date <= new Date(startDate.getTime() + currentMonth * 30 * 24 * 60 * 60 * 1000)
    ) {
      currentMonthPayment += sortedFundings[nextFundingIndex].amount;
      nextFundingIndex++;
    }

    const allocations = calculatePaymentAllocation(remainingDebts, currentMonthPayment);

    // Process payments and track interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const payment = allocations.get(debt.id) || 0;
      
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      results[debt.id].totalInterest += monthlyInterest;
      
      const newBalance = Math.max(0, currentBalance + monthlyInterest - payment);
      balances.set(debt.id, newBalance);
    }

    // Check for paid off debts
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = new Date(startDate);
        results[debt.id].payoffDate.setMonth(startDate.getMonth() + currentMonth + 1);
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle unpaid debts
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = new Date(startDate);
      results[debt.id].payoffDate.setMonth(startDate.getMonth() + maxMonths);
    }
  });

  return results;
};