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
  let activeDebts = [...debts];

  // Initialize all allocations to 0
  debts.forEach(debt => {
    allocation[debt.id] = 0;
  });

  // First pass: Allocate minimum payments
  activeDebts.forEach(debt => {
    const minPayment = Math.min(debt.minimumPayment, debt.balance);
    allocation[debt.id] = minPayment;
    remainingPayment -= minPayment;
  });

  console.log('After minimum payments, remaining:', remainingPayment);

  // Second pass: Distribute excess payment according to priority
  while (remainingPayment > 0 && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance - allocation[currentDebt.id];

    if (currentBalance > 0) {
      const additionalPayment = Math.min(remainingPayment, currentBalance);
      allocation[currentDebt.id] += additionalPayment;
      remainingPayment -= additionalPayment;
      
      console.log(`Allocated ${additionalPayment} extra to ${currentDebt.name}, remaining: ${remainingPayment}`);
      
      // If debt is fully paid off, remove it and redistribute remaining payment
      if (allocation[currentDebt.id] >= currentDebt.balance) {
        console.log(`${currentDebt.name} fully paid off, moving to next debt`);
        activeDebts = activeDebts.slice(1);
        // Continue the loop to reallocate remaining payment to next debt
        continue;
      }
    } else {
      // Remove debt that's already paid off and continue with next debt
      console.log(`${currentDebt.name} already paid off, moving to next debt`);
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // If we get here with remaining payment but can't allocate more to current debt,
    // move to next debt
    if (remainingPayment > 0 && allocation[currentDebt.id] >= currentDebt.balance) {
      activeDebts = activeDebts.slice(1);
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