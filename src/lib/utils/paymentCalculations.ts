import { Debt } from "../types/debt";
import { Strategy } from "../strategies";
import { calculateMonthlyInterest, calculatePayoffDate } from "./interestCalculations";
import { allocateMinimumPayments, allocateExtraPayment } from "./paymentAllocation";
import { initializeDebtTracking, createDebtStatus, DebtStatus } from "./debtTracking";

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy
): { [key: string]: DebtStatus } => {
  console.log('Starting payoff calculation with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = initializeDebtTracking(debts);
  let remainingDebts = [...debts];
  
  // Initialize results
  debts.forEach(debt => {
    results[debt.id] = createDebtStatus(0, 0, new Date());
  });

  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap

  // Continue until all debts are paid or we hit the cap
  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment;

    // Calculate interest for all debts
    remainingDebts.forEach(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);
      
      console.log(`Month ${currentMonth + 1}: ${debt.name} - Interest calculated:`, {
        balance: currentBalance.toFixed(2),
        interest: monthlyInterest.toFixed(2)
      });
    });

    // Allocate minimum payments
    const { allocations, remainingPayment } = allocateMinimumPayments(
      balances,
      remainingDebts,
      availablePayment
    );

    // Apply minimum payments
    allocations.forEach((payment, debtId) => {
      const currentBalance = balances.get(debtId) || 0;
      balances.set(debtId, currentBalance - payment);
    });

    // Allocate remaining payment to highest priority debt
    if (remainingPayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = allocateExtraPayment(
        targetDebt.id,
        currentBalance,
        remainingPayment
      );
      
      balances.set(targetDebt.id, currentBalance - extraPayment);
    }

    // Check which debts are paid off
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = calculatePayoffDate(currentMonth + 1);
        
        console.log(`${debt.name} paid off:`, {
          months: currentMonth + 1,
          totalInterest: results[debt.id].totalInterest.toFixed(2)
        });
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle debts that couldn't be paid off within maxMonths
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = calculatePayoffDate(maxMonths);
      console.log(`${debt.name} could not be paid off within ${maxMonths} months`);
    }
  });

  return results;
};