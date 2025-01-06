import { Debt } from "@/lib/types";

export interface Strategy {
  id: string;
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
}

export const avalancheStrategy: Strategy = {
  id: 'avalanche',
  name: "Avalanche Method",
  description: "Pay off debts with highest interest rate first",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => b.interest_rate - a.interest_rate);
  },
};

export const snowballStrategy: Strategy = {
  id: 'snowball',
  name: "Snowball Method",
  description: "Pay off smallest debts first",
  calculate: (debts: Debt[]) => {
    return [...debts].sort((a, b) => a.balance - b.balance);
  },
};

export const balanceRatioStrategy: Strategy = {
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