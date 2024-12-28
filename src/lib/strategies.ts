import { Debt } from "./types/debt";

export interface Strategy {
  id: string;
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
}

export const calculatePayoffTime = (debt: Debt, monthlyPayment: number): number => {
  if (monthlyPayment <= 0) return Infinity;
  
  let balance = debt.balance;
  let months = 0;
  const monthlyInterestRate = debt.interest_rate / 1200; // Convert annual rate to monthly
  const EPSILON = 0.01; // For floating point comparisons

  console.log(`Starting payoff calculation for ${debt.name}:`, {
    initialBalance: balance,
    monthlyPayment,
    monthlyInterestRate
  });

  while (balance > EPSILON && months < 1200) { // Cap at 100 years to prevent infinite loops
    const monthlyInterest = Number((balance * monthlyInterestRate).toFixed(2));
    
    if (monthlyPayment <= monthlyInterest) {
      console.log(`Payment ${monthlyPayment} cannot cover monthly interest ${monthlyInterest} for ${debt.name}`);
      return Infinity;
    }

    const principalPayment = Math.min(monthlyPayment - monthlyInterest, balance);
    balance = Number((Math.max(0, balance - principalPayment)).toFixed(2));
    
    console.log(`Month ${months + 1} for ${debt.name}:`, {
      startingBalance: Number((balance + principalPayment).toFixed(2)),
      interest: monthlyInterest,
      principalPayment: Number(principalPayment.toFixed(2)),
      newBalance: balance,
      monthlyPayment: Number(monthlyPayment.toFixed(2))
    });

    months++;

    if (balance <= EPSILON) {
      break;
    }
  }

  if (months >= 1200) {
    console.log(`${debt.name} will take too long to pay off`);
    return Infinity;
  }

  console.log(`${debt.name} will be paid off in ${months} months`);
  return months;
};

export const formatCurrency = (amount: number, currencySymbol: string = '£') => {
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const avalancheStrategy: Strategy = {
  id: 'avalanche',
  name: "Avalanche",
  description: "Pay off debts with highest interest rate first",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => b.interest_rate - a.interest_rate);
  },
};

const snowballStrategy: Strategy = {
  id: 'snowball',
  name: "Snowball",
  description: "Pay off smallest debts first",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => a.balance - b.balance);
  },
};

const balanceRatioStrategy: Strategy = {
  id: 'balance-ratio',
  name: "Balance Ratio",
  description: "Balance between interest rate and debt size",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => {
      const ratioA = a.interest_rate / a.balance;
      const ratioB = b.interest_rate / b.balance;
      return ratioB - ratioA;
    });
  },
};

export const strategies: Strategy[] = [
  avalancheStrategy,
  snowballStrategy,
  balanceRatioStrategy,
];