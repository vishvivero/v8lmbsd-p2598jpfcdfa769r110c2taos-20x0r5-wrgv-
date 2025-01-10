import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateDebtPayoff } from "@/lib/utils/payment/calculations/debtCalculator";

interface PaymentCalculatorProps {
  debts: Debt[];
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const calculateMonthlyAllocations = (
  debts: Debt[],
  totalMonthlyPayment: number,
  selectedStrategy: Strategy
) => {
  console.log('🔄 Starting allocation calculation:', {
    totalDebts: debts.length,
    totalMonthlyPayment,
    strategy: selectedStrategy.name
  });

  const { results, monthlyAllocations } = calculateDebtPayoff(
    debts,
    totalMonthlyPayment,
    selectedStrategy,
    []
  );

  // Convert monthly allocations to a Map for the first month
  const allocations = new Map<string, number>();
  if (monthlyAllocations.length > 0) {
    monthlyAllocations[0].forEach(allocation => {
      const currentAmount = allocations.get(allocation.debtId) || 0;
      allocations.set(allocation.debtId, currentAmount + allocation.amount);
    });
  }

  return { allocations, payoffDetails: results };
};

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