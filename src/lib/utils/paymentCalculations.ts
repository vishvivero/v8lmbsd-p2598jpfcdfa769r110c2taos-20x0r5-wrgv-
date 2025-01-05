import { Debt } from "@/lib/types/debt";
import { addMonths } from "date-fns";
import { Strategy } from "../strategies";
import { calculateMonthlyInterest, calculatePayoffDate } from "./interestCalculations";
import { initializeDebtTracking, createDebtStatus, DebtStatus } from "./debtTracking";

interface OneTimeFunding {
  amount: number;
  payment_date: Date;
}

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
  const maxMonths = 1200; // 100 years cap
  const startDate = new Date();
  let releasedPayments: { [key: string]: number } = {};
  let totalReleasedPayments = 0;

  // Initialize results
  debts.forEach(debt => {
    results[debt.id] = createDebtStatus(0, 0, new Date());
  });

  // Continue until all debts are paid or we hit the cap
  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    
    // Calculate total available payment for this month
    let availablePayment = monthlyPayment + totalReleasedPayments;

    console.log(`Month ${currentMonth + 1} payment allocation:`, {
      basePayment: monthlyPayment,
      releasedPayments,
      totalAvailable: availablePayment,
      remainingDebts: remainingDebts.map(d => d.name)
    });

    // Add any one-time funding that's due this month
    const currentDate = addMonths(startDate, currentMonth);
    const applicableFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getFullYear() === currentDate.getFullYear() &&
             fundingDate.getMonth() === currentDate.getMonth();
    });

    if (applicableFundings.length > 0) {
      const additionalPayment = applicableFundings.reduce((sum, funding) => sum + funding.amount, 0);
      availablePayment += additionalPayment;
      console.log(`Month ${currentMonth + 1}: Additional one-time funding:`, {
        additionalPayment,
        totalAvailable: availablePayment
      });
    }

    // Calculate interest and allocate minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);
      
      console.log(`Month ${currentMonth + 1}: ${debt.name} - Interest calculated:`, {
        balance: currentBalance.toFixed(2),
        interest: monthlyInterest.toFixed(2)
      });
    }

    // First, allocate minimum payments
    let remainingMonthlyPayment = availablePayment;
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      
      if (remainingMonthlyPayment >= minPayment) {
        balances.set(debt.id, currentBalance - minPayment);
        remainingMonthlyPayment -= minPayment;
        
        console.log(`Allocated minimum payment for ${debt.name}:`, {
          minPayment,
          remainingBalance: (currentBalance - minPayment).toFixed(2),
          remainingMonthlyPayment: remainingMonthlyPayment.toFixed(2)
        });
      }
    }

    // Then, allocate extra payment to highest priority debt
    if (remainingMonthlyPayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(remainingMonthlyPayment, currentBalance);
      
      if (extraPayment > 0) {
        balances.set(targetDebt.id, currentBalance - extraPayment);
        console.log(`Extra payment allocated to ${targetDebt.name}:`, {
          extraPayment: extraPayment.toFixed(2),
          newBalance: (currentBalance - extraPayment).toFixed(2)
        });
      }
    }

    // Check which debts are paid off and update released payments
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        // Store the minimum payment as released for redistribution
        releasedPayments[debt.id] = debt.minimum_payment;
        totalReleasedPayments += debt.minimum_payment;
        
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = calculatePayoffDate(currentMonth + 1);
        
        console.log(`${debt.name} paid off:`, {
          months: currentMonth + 1,
          totalInterest: results[debt.id].totalInterest.toFixed(2),
          releasedPayment: debt.minimum_payment,
          totalReleasedPayments
        });
        return false;
      }
      return true;
    });

    // If any debts were paid off, update the remaining debts list
    if (newRemainingDebts.length < remainingDebts.length) {
      remainingDebts = strategy.calculate([...newRemainingDebts]);
      console.log('Debts reordered after payoff:', remainingDebts.map(d => d.name));
    } else {
      remainingDebts = newRemainingDebts;
    }

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

export const calculatePayoffTimeline = (debt: Debt, extraPayment: number = 0) => {
  const monthlyRate = debt.interest_rate / 1200;
  let balance = debt.balance;
  let balanceWithExtra = debt.balance;
  const data = [];
  const startDate = new Date();
  let month = 0;

  while (balance > 0 || balanceWithExtra > 0) {
    const date = addMonths(startDate, month);
    
    // Calculate regular payment path
    if (balance > 0) {
      const interest = balance * monthlyRate;
      balance = Math.max(0, balance + interest - debt.minimum_payment);
    }

    // Calculate extra payment path
    if (balanceWithExtra > 0) {
      const interestExtra = balanceWithExtra * monthlyRate;
      balanceWithExtra = Math.max(0, balanceWithExtra + interestExtra - (debt.minimum_payment + extraPayment));
    }

    data.push({
      date: date.toISOString(),
      balance: Number(balance.toFixed(2)),
      balanceWithExtra: extraPayment > 0 ? Number(balanceWithExtra.toFixed(2)) : undefined
    });

    if (balance <= 0 && balanceWithExtra <= 0) break;
    month++;
  }

  return data;
};