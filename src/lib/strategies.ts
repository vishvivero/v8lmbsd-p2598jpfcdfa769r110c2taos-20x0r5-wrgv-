export interface Debt {
  id: string;
  name: string;
  bankerName: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface Strategy {
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
}

export const calculatePayoffTime = (debt: Debt, monthlyPayment: number): number => {
  if (monthlyPayment <= 0) return Infinity;
  
  let balance = debt.balance;
  let months = 0;
  const monthlyInterestRate = debt.interestRate / 1200;

  while (balance > 0 && months < 360) {
    balance = balance * (1 + monthlyInterestRate) - monthlyPayment;
    months++;
  }

  return months;
};

export const formatCurrency = (amount: number, currencySymbol: string = '$') => {
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const avalancheStrategy: Strategy = {
  name: "Avalanche",
  description: "Pay off debts with highest interest rate first",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => b.interestRate - a.interestRate);
  },
};

const snowballStrategy: Strategy = {
  name: "Snowball",
  description: "Pay off smallest debts first",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => a.balance - b.balance);
  },
};

const balanceRatioStrategy: Strategy = {
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