import { Debt } from "@/lib/types/debt";
import { Strategy } from "../types";

export const strategies: Strategy[] = [
  {
    id: 'avalanche',
    name: 'Debt Avalanche',
    description: 'Pay off debts with highest interest rate first',
    calculate: (debts: Debt[]) => 
      [...debts].sort((a, b) => b.interest_rate - a.interest_rate)
  },
  {
    id: 'snowball',
    name: 'Debt Snowball',
    description: 'Pay off smallest debts first',
    calculate: (debts: Debt[]) => 
      [...debts].sort((a, b) => a.balance - b.balance)
  }
];