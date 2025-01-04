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