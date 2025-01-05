import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding } from "./types";
import { addMonths } from "date-fns";

export const calculateMonthlyInterest = (balance: number, interestRate: number): number => {
  return (balance * (interestRate / 100)) / 12;
};

export const calculateMinimumPayments = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.minimum_payment, 0);
};

export const calculateTotalBalance = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.balance, 0);
};

export const calculatePayoffTime = (debt: Debt, monthlyPayment: number): number => {
  if (monthlyPayment <= calculateMonthlyInterest(debt.balance, debt.interest_rate)) {
    return Infinity;
  }

  let balance = debt.balance;
  let months = 0;

  while (balance > 0 && months < 1200) {
    const interest = calculateMonthlyInterest(balance, debt.interest_rate);
    balance = balance + interest - monthlyPayment;
    months++;
  }

  return months;
};

export const calculatePayoffSchedule = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: DebtStatus } => {
  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();
  let releasedPayments = 0;

  // Initialize balances and results
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
  });

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment + releasedPayments;

    // Add one-time funding for this month
    const currentDate = addMonths(startDate, currentMonth);
    const applicableFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return (
        fundingDate.getFullYear() === currentDate.getFullYear() &&
        fundingDate.getMonth() === currentDate.getMonth()
      );
    });

    availablePayment += applicableFundings.reduce((sum, funding) => sum + funding.amount, 0);

    // Process monthly payments and interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);

      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      if (availablePayment >= minPayment) {
        balances.set(debt.id, (balances.get(debt.id) || 0) - minPayment);
        availablePayment -= minPayment;
      }
    }

    // Apply extra payment to highest priority debt
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(availablePayment, currentBalance);
      balances.set(targetDebt.id, currentBalance - extraPayment);
    }

    // Check for paid off debts
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
        releasedPayments += debt.minimum_payment;
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle debts that couldn't be paid off
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    }
  });

  return results;
};