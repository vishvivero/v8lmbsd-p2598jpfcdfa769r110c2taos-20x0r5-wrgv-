import { Debt } from "@/lib/types/debt";
import { addMonths } from "date-fns";

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: { id: string; name: string; description: string; calculate: (debts: Debt[]) => Debt[] }
): { [key: string]: { months: number; totalInterest: number; payoffDate: Date } } => {
  console.log('Starting payoff calculation with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const results: { [key: string]: { months: number; totalInterest: number; payoffDate: Date } } = {};

  debts.forEach(debt => {
    const { months, totalInterest, payoffDate } = calculateSingleDebtPayoff(debt, debt.minimum_payment);
    results[debt.id] = { months, totalInterest, payoffDate };
    
    console.log(`${debt.name} payoff details:`, {
      months,
      totalInterest: totalInterest.toFixed(2),
      payoffDate: payoffDate.toISOString()
    });
  });

  return results;
};

const calculateSingleDebtPayoff = (
  debt: Debt,
  monthlyPayment: number
): { months: number; totalInterest: number; payoffDate: Date } => {
  const monthlyRate = debt.interest_rate / 1200; // Convert annual rate to monthly
  let balance = debt.balance;
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 1200; // 100 years cap

  // Check if payment can cover interest
  const minimumPaymentNeeded = balance * monthlyRate;
  if (monthlyPayment <= minimumPaymentNeeded) {
    console.log(`Monthly payment ${monthlyPayment} is insufficient to cover interest ${minimumPaymentNeeded} for ${debt.name}`);
    return {
      months: maxMonths,
      totalInterest: balance * monthlyRate * maxMonths,
      payoffDate: addMonths(new Date(), maxMonths)
    };
  }

  while (balance > 0.01 && months < maxMonths) {
    const monthlyInterest = balance * monthlyRate;
    totalInterest += monthlyInterest;
    
    const principalPayment = monthlyPayment - monthlyInterest;
    balance = Math.max(0, balance - principalPayment);
    
    console.log(`Month ${months + 1} for ${debt.name}:`, {
      interest: monthlyInterest.toFixed(2),
      principal: principalPayment.toFixed(2),
      remainingBalance: balance.toFixed(2)
    });
    
    months++;
  }

  return {
    months,
    totalInterest,
    payoffDate: addMonths(new Date(), months)
  };
};

export const calculatePayoffTimeline = (debt: Debt, extraPayment: number = 0) => {
  const monthlyRate = debt.interest_rate / 1200;
  let balance = debt.balance;
  let balanceWithExtra = debt.balance;
  const data = [];
  const startDate = new Date();
  let month = 0;

  while ((balance > 0 || balanceWithExtra > 0) && month < 360) { // Cap at 30 years
    const date = addMonths(startDate, month);
    
    // Calculate regular payment path
    if (balance > 0) {
      const interest = balance * monthlyRate;
      const payment = Math.min(debt.minimum_payment, balance + interest);
      balance = Math.max(0, balance + interest - payment);
    }

    // Calculate extra payment path
    if (balanceWithExtra > 0) {
      const interestExtra = balanceWithExtra * monthlyRate;
      const totalPayment = Math.min(debt.minimum_payment + extraPayment, balanceWithExtra + interestExtra);
      balanceWithExtra = Math.max(0, balanceWithExtra + interestExtra - totalPayment);
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