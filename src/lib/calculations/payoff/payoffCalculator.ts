import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding, PayoffSummary } from "./types";
import { addMonths } from "date-fns";

const EPSILON = 0.01;
const MAX_MONTHS = 1200; // 100 years cap

export const calculateMonthlyInterest = (balance: number, interestRate: number): number => {
  return Number(((balance * (interestRate / 100)) / 12).toFixed(2));
};

export const calculateMinimumPayments = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.minimum_payment, 0);
};

export const calculateTotalBalance = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.balance, 0);
};

export const calculatePayoffSummary = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): PayoffSummary => {
  const payoffDetails = calculatePayoffSchedule(debts, monthlyPayment, strategy, oneTimeFundings);
  
  const debtPayoffOrder = Object.entries(payoffDetails)
    .sort((a, b) => a[1].months - b[1].months)
    .map(([debtId]) => debtId);

  const totalMonths = Math.max(...Object.values(payoffDetails).map(detail => detail.months));
  const totalInterest = Object.values(payoffDetails)
    .reduce((sum, detail) => sum + detail.totalInterest, 0);
  
  const finalPayoffDate = Object.values(payoffDetails)
    .reduce((latest, detail) => 
      detail.payoffDate > latest ? detail.payoffDate : latest,
      new Date()
    );

  const monthlyPayments = calculateInitialPayments(debts, monthlyPayment, strategy);

  return {
    totalMonths,
    totalInterest,
    finalPayoffDate,
    debtPayoffOrder,
    monthlyPayments
  };
};

const calculateInitialPayments = (
  debts: Debt[],
  totalMonthlyPayment: number,
  strategy: Strategy
) => {
  const sortedDebts = strategy.calculate([...debts]);
  const minimumTotal = calculateMinimumPayments(debts);
  const extraPayment = Math.max(0, totalMonthlyPayment - minimumTotal);
  
  return sortedDebts.map((debt, index) => ({
    debtId: debt.id,
    amount: debt.minimum_payment + (index === 0 ? extraPayment : 0)
  }));
};

export const calculatePayoffSchedule = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: DebtStatus } => {
  console.log('Starting payoff calculation:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name,
    oneTimeFundings
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  const minimumPayments = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const startDate = new Date();
  let releasedPayments = 0;

  // Initialize tracking
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
  });

  // Calculate total minimum payments required
  const totalMinimumPayments = calculateMinimumPayments(debts);
  
  if (monthlyPayment < totalMinimumPayments) {
    console.warn('Monthly payment insufficient to cover minimum payments');
    debts.forEach(debt => {
      results[debt.id].months = MAX_MONTHS;
      results[debt.id].payoffDate = addMonths(startDate, MAX_MONTHS);
    });
    return results;
  }

  while (remainingDebts.length > 0 && currentMonth < MAX_MONTHS) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment + releasedPayments;
    releasedPayments = 0;

    const currentDate = addMonths(startDate, currentMonth);
    
    // Process one-time fundings for this month
    const monthlyFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });

    availablePayment += monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);

    // Handle minimum payments and calculate interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      results[debt.id].totalInterest += monthlyInterest;
      
      balances.set(debt.id, currentBalance + monthlyInterest);
      
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance + monthlyInterest);
      if (availablePayment >= minPayment) {
        balances.set(debt.id, (balances.get(debt.id) || 0) - minPayment);
        availablePayment -= minPayment;
      }
    }

    // Apply extra payments according to strategy
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(availablePayment, currentBalance);
      
      if (extraPayment > 0) {
        balances.set(targetDebt.id, currentBalance - extraPayment);
      }
    }

    // Check for paid off debts and handle redistributions
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= EPSILON) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
        
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        releasedPayments += releasedPayment;

        const nextDebt = remainingDebts.find(d => d.id !== debt.id);
        if (nextDebt && results[nextDebt.id].redistributionHistory) {
          results[nextDebt.id].redistributionHistory?.push({
            fromDebtId: debt.id,
            amount: releasedPayment,
            month: currentMonth + 1
          });
        }
        
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle debts that couldn't be paid off
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = MAX_MONTHS;
      results[debt.id].payoffDate = addMonths(startDate, MAX_MONTHS);
    }
  });

  return results;
};