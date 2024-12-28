export type Debt = {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  bankerName: string;
};

export type Strategy = {
  id: string;
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
};

export const strategies: Strategy[] = [
  {
    id: "snowball",
    name: "Snowball Method",
    description: "Pay off debts from smallest to largest balance",
    calculate: (debts: Debt[]) => [...debts].sort((a, b) => a.balance - b.balance),
  },
  {
    id: "avalanche",
    name: "Avalanche Method",
    description: "Pay off debts with highest interest rate first",
    calculate: (debts: Debt[]) => [...debts].sort((a, b) => b.interestRate - a.interestRate),
  },
  {
    id: "balance",
    name: "Balance First",
    description: "Pay off debts with highest balance first",
    calculate: (debts: Debt[]) => [...debts].sort((a, b) => b.balance - a.balance),
  },
  {
    id: "custom",
    name: "Custom Order",
    description: "Keep debts in the order you entered them",
    calculate: (debts: Debt[]) => [...debts],
  },
];

export const calculatePayoffTime = (debt: Debt, monthlyPayment: number): number => {
  if (monthlyPayment <= 0) return Infinity;
  const monthlyRate = debt.interestRate / 12 / 100;
  let balance = debt.balance;
  let months = 0;

  while (balance > 0 && months < 360) {
    balance = balance * (1 + monthlyRate) - monthlyPayment;
    months++;
  }

  return months;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};