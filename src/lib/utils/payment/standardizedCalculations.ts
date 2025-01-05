import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculatePayoffDetails } from "./paymentCalculations";
import { OneTimeFunding } from "./types";

export const calculateStandardizedPayoff = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
) => {
  console.log('Calculating standardized payoff with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name,
    oneTimeFundings
  });

  const payoffDetails = calculatePayoffDetails(
    strategy.calculate([...debts]),
    monthlyPayment,
    strategy,
    oneTimeFundings
  );

  console.log('Standardized payoff calculation results:', payoffDetails);

  return payoffDetails;
};

export const calculateSingleDebtPayoff = (
  debt: Debt,
  monthlyPayment: number,
  strategy: Strategy
) => {
  console.log('Calculating single debt payoff for:', {
    debtName: debt.name,
    monthlyPayment,
    strategy: strategy.name
  });

  const payoffDetails = calculatePayoffDetails(
    [debt],
    monthlyPayment,
    strategy,
    []
  );

  console.log('Single debt payoff calculation results:', payoffDetails[debt.id]);

  return payoffDetails[debt.id];
};