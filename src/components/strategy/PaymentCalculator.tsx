import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/calculations/types";
import { calculatePayoffDetails } from "@/lib/calculations";

export const calculateMonthlyAllocations = (
  debts: Debt[],
  totalMonthlyPayment: number,
  selectedStrategy: Strategy
) => {
  console.log('Starting allocation calculation:', {
    totalDebts: debts.length,
    totalMonthlyPayment,
    strategy: selectedStrategy.name
  });

  const sortedDebts = selectedStrategy.calculate([...debts]);
  const allocations = new Map<string, number>();
  const payoffDetails = calculatePayoffDetails(sortedDebts, totalMonthlyPayment, selectedStrategy);
  
  // Initialize with minimum payments
  let remainingPayment = totalMonthlyPayment;
  sortedDebts.forEach(debt => {
    const minPayment = Math.min(debt.minimum_payment, remainingPayment);
    allocations.set(debt.id, minPayment);
    remainingPayment -= minPayment;
  });

  // Allocate remaining payment to highest priority debt
  if (remainingPayment > 0 && sortedDebts.length > 0) {
    const highestPriorityDebt = sortedDebts[0];
    const currentAllocation = allocations.get(highestPriorityDebt.id) || 0;
    allocations.set(
      highestPriorityDebt.id, 
      currentAllocation + remainingPayment
    );
  }

  console.log('Payment allocations calculated:', {
    totalPayment: totalMonthlyPayment,
    allocations: Array.from(allocations.entries()).map(([id, amount]) => ({
      debtName: debts.find(d => d.id === id)?.name,
      allocation: amount
    }))
  });

  return { allocations, payoffDetails };
};

interface PaymentCalculatorProps {
  debts: Debt[];
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const PaymentCalculator: React.FC<PaymentCalculatorProps> = ({
  debts,
  totalMonthlyPayment,
  selectedStrategy,
}) => {
  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    debts,
    totalMonthlyPayment,
    selectedStrategy
  );

  return null; // This is a logic-only component
};