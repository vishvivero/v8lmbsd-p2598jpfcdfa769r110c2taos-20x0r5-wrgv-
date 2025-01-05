import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { OneTimeFunding, DebtStatus } from "./types";
import { calculateMonthlyInterest } from "./interestCalculations";
import { initializeDebtTracking, createDebtStatus } from "./debtStatusTracking";
import { recordPaymentRedistribution, updateDebtStatus } from "./paymentRedistribution";
import { initializeRedistributionHistory, trackRedistribution } from "./redistributionTracking";
import { addMonths } from "date-fns";

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: DebtStatus } => {
  console.log('Starting payoff calculation with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name,
    oneTimeFundings
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = initializeDebtTracking(debts);
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();
  let releasedPayments = 0;
  const redistributionHistory = initializeRedistributionHistory();

  // Initialize results
  debts.forEach(debt => {
    results[debt.id] = createDebtStatus(0, 0, new Date());
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

    if (applicableFundings.length > 0) {
      const additionalPayment = applicableFundings.reduce((sum, funding) => sum + funding.amount, 0);
      availablePayment += additionalPayment;
    }

    // Calculate interest and minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);
    }

    // Allocate payments
    let remainingMonthlyPayment = availablePayment;
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      
      if (remainingMonthlyPayment >= minPayment) {
        balances.set(debt.id, currentBalance - minPayment);
        remainingMonthlyPayment -= minPayment;
      }
    }

    // Allocate extra payment to highest priority debt
    if (remainingMonthlyPayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(remainingMonthlyPayment, currentBalance);
      
      if (extraPayment > 0) {
        balances.set(targetDebt.id, currentBalance - extraPayment);
      }
    }

    // Check for paid off debts and handle redistribution
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        const releasedAmount = debt.minimum_payment;
        releasedPayments += releasedAmount;
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
        
        // Update debt status and record redistribution
        updateDebtStatus(debt.id).catch(console.error);
        
        // Record redistribution if there's a next debt
        if (remainingDebts.length > 1) {
          const nextDebt = remainingDebts[1];
          trackRedistribution(
            redistributionHistory,
            debt,
            nextDebt.id,
            releasedAmount,
            currentMonth + 1
          );

          recordPaymentRedistribution({
            fromDebtId: debt.id,
            toDebtId: nextDebt.id,
            amount: releasedAmount
          }).catch(console.error);
        }
        
        return false;
      }
      return true;
    });

    if (newRemainingDebts.length < remainingDebts.length) {
      remainingDebts = strategy.calculate([...newRemainingDebts]);
    } else {
      remainingDebts = newRemainingDebts;
    }

    currentMonth++;
  }

  // Handle debts that couldn't be paid off
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    }
  });

  // Add redistribution history to results
  Object.keys(results).forEach(debtId => {
    results[debtId].redistributionHistory = redistributionHistory.get(debtId) || [];
  });

  return results;
};