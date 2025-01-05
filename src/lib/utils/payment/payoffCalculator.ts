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
  console.log('Starting payoff calculation with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();
  let releasedPayments = new Map<string, number>();

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

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment;

    // Add any released payments from previous month
    for (const [debtId, amount] of releasedPayments.entries()) {
      availablePayment += amount;
    }
    releasedPayments.clear();

    // Process monthly payments and interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);

      // Calculate payment amount
      const minPayment = Math.min(debt.minimum_payment, currentBalance + monthlyInterest);
      let paymentAmount = minPayment;

      // If this is the highest priority debt, add extra payment
      if (debt.id === remainingDebts[0].id) {
        paymentAmount += Math.min(
          availablePayment - minPayment,
          (balances.get(debt.id) || 0)
        );
      }

      // Apply payment
      const newBalance = Math.max(0, (balances.get(debt.id) || 0) - paymentAmount);
      balances.set(debt.id, newBalance);
      availablePayment -= paymentAmount;

      console.log(`Month ${currentMonth + 1} calculation for ${debt.name}:`, {
        startingBalance: currentBalance,
        interest: monthlyInterest,
        payment: paymentAmount,
        newBalance,
        isLastPayment: newBalance <= 0.01
      });
    }

    // Check for paid off debts and handle redistribution
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);

        // When a debt is paid off, track its final payment for redistribution
        const finalPayment = Math.min(
          debt.minimum_payment,
          debt.balance + calculateMonthlyInterest(debt.balance, debt.interest_rate)
        );
        
        // Store the actual minimum payment amount to be redistributed
        releasedPayments.set(debt.id, debt.minimum_payment);

        // Record redistribution if there are remaining debts
        if (remainingDebts.length > 1) {
          const nextDebt = strategy.calculate(
            remainingDebts.filter(d => d.id !== debt.id)
          )[0];

          if (nextDebt) {
            const redistributedAmount = debt.minimum_payment - finalPayment;
            if (redistributedAmount > 0) {
              if (!results[nextDebt.id].redistributionHistory) {
                results[nextDebt.id].redistributionHistory = [];
              }
              results[nextDebt.id].redistributionHistory?.push({
                fromDebtId: debt.id,
                amount: redistributedAmount,
                month: currentMonth + 2 // Add 2 because redistribution starts next month
              });
            }
          }
        }
        
        return false;
      }
      return true;
    });

    remainingDebts = newRemainingDebts;
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