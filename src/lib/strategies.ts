export interface Debt {
  id: string;
  name: string;
  bankerName: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

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
  const monthlyInterestRate = debt.interestRate / 1200; // Convert annual rate to monthly

  console.log(`Starting payoff calculation for ${debt.name}:`, {
    initialBalance: balance,
    monthlyPayment,
    monthlyInterestRate
  });

  // Continue until balance is effectively zero (accounting for floating point)
  while (balance > 0.01 && months < 1200) { // Cap at 100 years to prevent infinite loops
    const monthlyInterest = balance * monthlyInterestRate;
    
    // If payment can't cover interest, debt will never be paid off
    if (monthlyPayment <= monthlyInterest) {
      console.log(`Payment ${monthlyPayment} cannot cover monthly interest ${monthlyInterest} for ${debt.name}`);
      return Infinity;
    }

    const principalPayment = Math.min(monthlyPayment - monthlyInterest, balance);
    balance = Math.max(0, balance - principalPayment);
    
    console.log(`Month ${months + 1} for ${debt.name}:`, {
      startingBalance: balance + principalPayment,
      interest: monthlyInterest,
      principalPayment,
      newBalance: balance,
      monthlyPayment
    });

    months++;
  }

  // If we hit the month cap, return Infinity
  if (months >= 1200) {
    console.log(`${debt.name} will take too long to pay off`);
    return Infinity;
  }

  console.log(`${debt.name} will be paid off in ${months} months`);
  return months;
};

export const formatCurrency = (amount: number, currencySymbol: string = '$') => {
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
    return [...debts].sort((a, b) => b.interestRate - a.interestRate);
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
      const ratioA = a.interestRate / a.balance;
      const ratioB = b.interestRate / b.balance;
      return ratioB - ratioA;
    });
  },
};

export const strategies: Strategy[] = [
  avalancheStrategy,
  snowballStrategy,
  balanceRatioStrategy,
];