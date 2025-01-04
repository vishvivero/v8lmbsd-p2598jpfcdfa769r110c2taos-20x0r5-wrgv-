import { Debt } from "@/lib/types/debt";
import { strategies } from "@/lib/strategies";

interface PaymentAllocation {
  debtId: string;
  debtName: string;
  payment: number;
}

export const calculatePaymentDistribution = (
  debts: Debt[],
  totalMonthlyPayment: number,
  strategyId: string
): PaymentAllocation[] => {
  if (!debts?.length || totalMonthlyPayment <= 0) {
    return [];
  }

  console.log('Calculating payment distribution:', {
    totalDebts: debts.length,
    totalMonthlyPayment,
    strategyId
  });

  // Get the selected strategy
  const strategy = strategies.find(s => s.id === strategyId) || strategies[0];
  
  // Sort debts according to strategy
  const sortedDebts = strategy.calculate([...debts]);
  
  // Initialize allocations with minimum payments
  const allocations: PaymentAllocation[] = [];
  let remainingPayment = totalMonthlyPayment;

  // First, allocate minimum payments
  sortedDebts.forEach(debt => {
    const minPayment = Math.min(debt.minimum_payment, debt.balance);
    if (remainingPayment >= minPayment) {
      allocations.push({
        debtId: debt.id,
        debtName: debt.name,
        payment: minPayment
      });
      remainingPayment -= minPayment;
    }
  });

  // Then, allocate extra payments to highest priority debt
  if (remainingPayment > 0 && sortedDebts.length > 0) {
    const targetDebt = sortedDebts[0];
    const existingAllocation = allocations.find(a => a.debtId === targetDebt.id);
    
    if (existingAllocation) {
      const maxExtraPayment = targetDebt.balance - existingAllocation.payment;
      const extraPayment = Math.min(remainingPayment, maxExtraPayment);
      existingAllocation.payment += extraPayment;
      remainingPayment -= extraPayment;
    }
  }

  console.log('Payment distribution calculated:', allocations);
  return allocations;
};

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: { id: string; name: string; calculate: (debts: Debt[]) => Debt[] }
) => {
  console.log('Calculating payoff details with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const sortedDebts = strategy.calculate([...debts]);
  const details: { [key: string]: { months: number; totalInterest: number; payoffDate: Date } } = {};

  sortedDebts.forEach(debt => {
    let balance = debt.balance;
    let months = 0;
    let totalInterest = 0;
    const monthlyRate = debt.interest_rate / 1200;

    while (balance > 0.01 && months < 1200) {
      const interest = balance * monthlyRate;
      totalInterest += interest;

      if (monthlyPayment <= interest) {
        months = Infinity;
        break;
      }

      const principalPayment = monthlyPayment - interest;
      balance = Math.max(0, balance - principalPayment);
      months++;
    }

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    details[debt.id] = {
      months: months === Infinity ? 0 : months,
      totalInterest: Number(totalInterest.toFixed(2)),
      payoffDate
    };

    console.log(`${debt.name} paid off:`, {
      months,
      totalInterest: totalInterest.toFixed(2)
    });
  });

  return details;
};

export const calculatePayoffTimeline = (debt: Debt, extraPayment: number = 0): any[] => {
  const monthlyPayment = debt.minimum_payment + extraPayment;
  const data: any[] = [];
  let balance = debt.balance;
  let currentDate = new Date();
  const monthlyRate = debt.interest_rate / 1200;

  while (balance > 0.01 && data.length < 360) {
    const interest = balance * monthlyRate;
    console.log(`Month ${data.length}: ${debt.name} - Interest calculated:`, {
      balance: balance.toFixed(2),
      interest: interest.toFixed(2)
    });

    if (monthlyPayment <= interest) {
      console.log(`Payment cannot cover interest for ${debt.name}`);
      break;
    }

    const principalPayment = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - principalPayment);

    console.log(`Allocated minimum payment for ${debt.name}:`, {
      minPayment: monthlyPayment,
      remainingBalance: balance
    });

    if (extraPayment > 0) {
      console.log(`Allocating extra payment:`, {
        payment: extraPayment,
        remainingBalance: balance
      });
    }

    data.push({
      date: currentDate.toISOString(),
      balance: Number(balance.toFixed(2)),
      balanceWithExtra: extraPayment > 0 ? balance : undefined
    });

    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  }

  return data;
};