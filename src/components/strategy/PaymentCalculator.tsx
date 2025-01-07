import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateUnifiedPayoff } from "@/lib/utils/payment/unifiedCalculator";
import { OneTimeFunding } from "@/lib/types/payment";

interface PaymentCalculatorProps {
  debts: Debt[];
  monthlyPayment: number;
  selectedStrategy: Strategy;
  oneTimeFundings?: OneTimeFunding[];
}

export const PaymentCalculator = ({
  debts,
  monthlyPayment,
  selectedStrategy,
  oneTimeFundings = []
}: PaymentCalculatorProps) => {
  console.log('PaymentCalculator: Starting calculation with:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    strategy: selectedStrategy.name,
    oneTimeFundings: oneTimeFundings.length
  });

  // Sort debts according to strategy
  const sortedDebts = selectedStrategy.calculate([...debts]);
  
  // Calculate payoff details using unified calculator
  const payoffDetails = calculateUnifiedPayoff(
    sortedDebts,
    monthlyPayment,
    oneTimeFundings
  );

  console.log('PaymentCalculator: Calculation complete:', {
    results: Object.keys(payoffDetails).map(debtId => ({
      debtId,
      months: payoffDetails[debtId].months,
      totalInterest: payoffDetails[debtId].totalInterest,
      payoffDate: payoffDetails[debtId].payoffDate
    }))
  });

  return null; // This is a logic-only component
};

export const calculateMonthlyAllocations = (
  debts: Debt[],
  monthlyPayment: number,
  selectedStrategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
) => {
  const sortedDebts = selectedStrategy.calculate([...debts]);
  const payoffDetails = calculateUnifiedPayoff(
    sortedDebts,
    monthlyPayment,
    oneTimeFundings
  );

  // Convert payoff details to allocations map
  const allocations = new Map<string, number>();
  
  sortedDebts.forEach(debt => {
    const details = payoffDetails[debt.id];
    if (details.monthlyPayments.length > 0) {
      const firstPayment = details.monthlyPayments[0];
      allocations.set(debt.id, firstPayment.payment);
    }
  });

  return allocations;
};