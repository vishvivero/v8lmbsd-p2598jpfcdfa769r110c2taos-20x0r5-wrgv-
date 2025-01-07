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

export interface PaymentAllocation {
  allocations: Map<string, number>;
  payoffDetails: {
    [key: string]: {
      months: number;
      totalInterest: number;
      payoffDate: Date;
      monthlyPayments: Array<{
        date: Date;
        payment: number;
        interest: number;
        principal: number;
        remainingBalance: number;
      }>;
    };
  };
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

  console.log('PaymentCalculator: Calculation complete');

  return null; // This is a logic-only component
};

export const calculateMonthlyAllocations = (
  debts: Debt[],
  monthlyPayment: number,
  selectedStrategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): PaymentAllocation => {
  const sortedDebts = selectedStrategy.calculate([...debts]);
  const payoffDetails = calculateUnifiedPayoff(
    sortedDebts,
    monthlyPayment,
    oneTimeFundings
  );

  // Convert payoff details to allocations map
  const allocations = new Map<string, number>();
  
  sortedDebts.forEach(debt => {
    if (payoffDetails[debt.id]?.monthlyPayments.length > 0) {
      const firstPayment = payoffDetails[debt.id].monthlyPayments[0];
      allocations.set(debt.id, firstPayment.payment);
    }
  });

  return { allocations, payoffDetails };
};