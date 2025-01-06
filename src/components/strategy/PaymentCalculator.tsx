import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/calculations/types";
import { calculatePayoffDetails, calculateMonthlyAllocations } from "@/lib/calculations";

interface PaymentCalculatorProps {
  debts: Debt[];
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const calculateMonthlyPayments = (
  debts: Debt[],
  totalMonthlyPayment: number,
  selectedStrategy: Strategy
) => {
  console.log('🔄 Starting allocation calculation:', {
    totalDebts: debts.length,
    totalMonthlyPayment,
    strategy: selectedStrategy.name
  });

  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    debts,
    totalMonthlyPayment,
    selectedStrategy
  );

  console.log('📊 Final allocation summary:', {
    totalMonthlyPayment,
    allocations: Array.from(allocations.entries()).map(([debtId, amount]) => ({
      debtName: debts.find(d => d.id === debtId)?.name,
      allocation: amount
    }))
  });

  return { allocations, payoffDetails };
};

export const PaymentCalculator: React.FC<PaymentCalculatorProps> = ({
  debts,
  totalMonthlyPayment,
  selectedStrategy,
}) => {
  const { allocations, payoffDetails } = calculateMonthlyPayments(
    debts,
    totalMonthlyPayment,
    selectedStrategy
  );

  return null; // This is a logic-only component
};