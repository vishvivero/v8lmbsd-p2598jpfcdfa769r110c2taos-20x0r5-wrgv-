import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding } from "./types";
import { calculateMonthlyInterest } from "./interestCalculations";
import { recordPaymentRedistribution } from "./paymentRedistribution";
import { trackRedistribution } from "./redistributionTracking";
import { addMonths } from "date-fns";

const calculateInitialState = (debts: Debt[]) => {
  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  const minimumPayments = new Map<string, number>();
  const cascadedPayments = new Map<string, number>();

  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    cascadedPayments.set(debt.id, 0);
  });

  return { results, balances, minimumPayments, cascadedPayments };
};

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: DebtStatus } => {
  console.log('Starting payoff calculation:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const { results, balances, minimumPayments, cascadedPayments } = calculateInitialState(debts);
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let monthlyAvailable = monthlyPayment;

    // Add any one-time funding for this month
    const currentDate = addMonths(startDate, currentMonth);
    const monthlyFunding = oneTimeFundings
      .filter(funding => {
        const fundingDate = new Date(funding.payment_date);
        return fundingDate.getMonth() === currentDate.getMonth() &&
               fundingDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, funding) => sum + funding.amount, 0);
    
    monthlyAvailable += monthlyFunding;

    console.log(`Month ${currentMonth + 1} calculation:`, {
      availablePayment: monthlyAvailable,
      oneTimeFunding: monthlyFunding,
      activeDebts: remainingDebts.length
    });

    // Process payments for each debt
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200;
      const cascadedAmount = cascadedPayments.get(debt.id) || 0;
      const totalAvailable = monthlyAvailable + cascadedAmount;

      // Calculate monthly interest
      const monthlyInterest = calculateMonthlyInterest(currentBalance, monthlyRate);
      results[debt.id].totalInterest += monthlyInterest;

      // Calculate payment
      const minPayment = Math.min(debt.minimum_payment, currentBalance + monthlyInterest);
      const maxPayment = Math.min(totalAvailable, currentBalance + monthlyInterest);
      const actualPayment = Math.max(minPayment, maxPayment);

      // Update balance
      const newBalance = Math.max(0, currentBalance + monthlyInterest - actualPayment);
      balances.set(debt.id, newBalance);
      
      // Update available payment
      monthlyAvailable = Math.max(0, monthlyAvailable - (actualPayment - cascadedAmount));

      // Check if debt is paid off
      if (newBalance <= 0.01) {
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        const totalRedistributed = releasedPayment + cascadedAmount;

        // Find next debt for redistribution
        const nextDebt = remainingDebts.find(d => d.id !== debt.id);
        if (nextDebt) {
          console.log(`Redistributing payment from ${debt.name}:`, {
            baseAmount: releasedPayment,
            cascadedAmount,
            totalRedistributed,
            toDebt: nextDebt.name
          });

          // Track redistribution
          trackRedistribution(
            results,
            debt.id,
            nextDebt.id,
            releasedPayment,
            currentMonth + 1,
            cascadedAmount
          );

          // Update cascaded payments for next debt
          cascadedPayments.set(
            nextDebt.id,
            (cascadedPayments.get(nextDebt.id) || 0) + totalRedistributed
          );

          // Record redistribution
          recordPaymentRedistribution({
            fromDebtId: debt.id,
            toDebtId: nextDebt.id,
            amount: totalRedistributed,
            userId: debt.user_id,
            currencySymbol: debt.currency_symbol
          }).catch(console.error);
        }

        // Update final details for paid off debt
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
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