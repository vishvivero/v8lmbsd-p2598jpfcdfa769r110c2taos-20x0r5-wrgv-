import { Debt } from "./types/debt";
import { calculateMonthlyAllocation, calculatePayoffTime, formatCurrency } from "./paymentCalculator";

export type { Debt };
export { calculateMonthlyAllocation, calculatePayoffTime, formatCurrency };

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