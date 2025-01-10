import { useCallback } from "react";
import { Debt } from "@/lib/types/debt";
import { Strategy } from "@/lib/strategies";
import { debtCalculationService, PayoffDetails } from "@/lib/services/DebtCalculationService";

export const useDebtCalculations = () => {
  const calculatePayoffDetails = useCallback(
    (
      debts: Debt[],
      monthlyPayment: number,
      strategy: Strategy,
      oneTimeFundings: { amount: number; payment_date: Date }[] = []
    ): { [key: string]: PayoffDetails } => {
      console.log('useDebtCalculations: Calculating payoff details', {
        debts: debts.length,
        monthlyPayment,
        strategy: strategy.name
      });
      
      return debtCalculationService.calculatePayoffDetails(
        debts,
        monthlyPayment,
        strategy,
        oneTimeFundings
      );
    },
    []
  );

  const calculateTotalMinimumPayments = useCallback((debts: Debt[]): number => {
    return debtCalculationService.calculateTotalMinimumPayments(debts);
  }, []);

  return {
    calculatePayoffDetails,
    calculateTotalMinimumPayments
  };
};