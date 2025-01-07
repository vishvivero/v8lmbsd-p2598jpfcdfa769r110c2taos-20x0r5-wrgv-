import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateUnifiedPayoff } from "@/lib/utils/payment/unifiedCalculator";
import { OneTimeFunding } from "@/lib/types/payment";

export interface PaymentAllocation {
  allocations: { [key: string]: number };
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
}: {
  debts: Debt[];
  monthlyPayment: number;
  selectedStrategy: Strategy;
  oneTimeFundings?: OneTimeFunding[];
}) => {
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
  if (!debts || debts.length === 0) {
    return {
      allocations: {},
      payoffDetails: {}
    };
  }

  const sortedDebts = selectedStrategy.calculate([...debts]);
  const payoffDetails = calculateUnifiedPayoff(
    sortedDebts,
    monthlyPayment,
    oneTimeFundings
  );

  // Convert payoff details to allocations object
  const allocations: { [key: string]: number } = {};
  
  sortedDebts.forEach(debt => {
    if (payoffDetails[debt.id]?.monthlyPayments.length > 0) {
      const firstPayment = payoffDetails[debt.id].monthlyPayments[0];
      allocations[debt.id] = firstPayment.payment;
    } else {
      allocations[debt.id] = 0;
    }
  });

  return { allocations, payoffDetails };
};