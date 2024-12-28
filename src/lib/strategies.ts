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
  const monthlyInterestRate = debt.interestRate / 1200;

  while (balance > 0.01 && months < 1200) {
    const monthlyInterest = balance * monthlyInterestRate;
    
    if (monthlyPayment <= monthlyInterest) {
      console.log(`Payment ${monthlyPayment} cannot cover interest ${monthlyInterest} for ${debt.name}`);
      return Infinity;
    }

    const principalPayment = monthlyPayment - monthlyInterest;
    balance = Math.max(0, balance - principalPayment);
    
    console.log(`Month ${months + 1} for ${debt.name}:`, {
      startingBalance: balance + principalPayment,
      interest: monthlyInterest,
      payment: monthlyPayment,
      principalPaid: principalPayment,
      newBalance: balance
    });

    months++;
  }

  return months >= 1200 ? Infinity : months;
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