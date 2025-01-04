import { Debt } from "./types";

export interface Strategy {
  id: string;
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
}

export const formatCurrency = (amount: number, symbol: string = "£") => {
  return `${symbol}${amount.toLocaleString()}`;
};

export const strategies: Strategy[] = [
  {
    id: "avalanche",
    name: "Debt Avalanche",
    description: "Pay off debts with highest interest rate first",
    calculate: (debts) => {
      return [...debts].sort((a, b) => b.interest_rate - a.interest_rate);
    },
  },
  {
    id: "snowball",
    name: "Debt Snowball",
    description: "Pay off smallest debts first for quick wins",
    calculate: (debts) => {
      return [...debts].sort((a, b) => a.balance - b.balance);
    },
  },
  {
    id: "balance",
    name: "Balance First",
    description: "Pay off highest balance debts first",
    calculate: (debts) => {
      return [...debts].sort((a, b) => b.balance - a.balance);
    },
  },
];