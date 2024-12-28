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

export const calculateMonthlyAllocation = (
  debts: Debt[],
  monthlyPayment: number
): { [key: string]: number } => {
  console.log('Starting monthly allocation with payment:', monthlyPayment);
  
  const allocation: { [key: string]: number } = {};
  let remainingPayment = monthlyPayment;

  // Step 1: Initialize all allocations to 0
  debts.forEach(debt => {
    allocation[debt.id] = 0;
  });

  // Step 2: Allocate minimum payments first
  debts.forEach(debt => {
    const minPayment = Math.min(debt.minimumPayment, debt.balance);
    allocation[debt.id] = minPayment;
    remainingPayment -= minPayment;
  });

  console.log('After minimum payments, remaining:', remainingPayment);

  // Step 3: Distribute excess payment according to priority
  if (remainingPayment > 0) {
    // Process debts in order of priority
    for (const debt of debts) {
      // Calculate how much more this debt needs to be fully paid
      const currentBalance = debt.balance;
      const currentAllocation = allocation[debt.id];
      const remainingBalance = currentBalance - currentAllocation;

      if (remainingBalance > 0) {
        // Allocate either the remaining payment or what's needed to pay off the debt
        const additionalPayment = Math.min(remainingPayment, remainingBalance);
        allocation[debt.id] += additionalPayment;
        remainingPayment -= additionalPayment;
        
        console.log(`Allocated ${additionalPayment} extra to ${debt.name}, remaining: ${remainingPayment}`);
        
        if (remainingPayment <= 0) break;
      }
    }
  }

  return allocation;
};

export const calculatePayoffTime = (
  debt: Debt,
  availablePayment: number,
  monthlyPayment: number
): number => {
  if (availablePayment <= 0) return Infinity;
  
  const monthlyRate = debt.interestRate / 1200;
  const balance = debt.balance;
  
  if (monthlyRate === 0) {
    return Math.ceil(balance / availablePayment);
  }
  
  const months = Math.ceil(
    -Math.log(1 - (monthlyRate * balance) / availablePayment) / Math.log(1 + monthlyRate)
  );
  
  return isNaN(months) || months <= 0 ? Infinity : months;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};