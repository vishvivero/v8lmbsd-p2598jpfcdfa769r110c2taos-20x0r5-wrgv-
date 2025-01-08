import { useMemo } from "react";
import { useDebts } from "./use-debts";
import { useOneTimeFunding } from "./use-one-time-funding";
import { calculateUnifiedPayoff } from "@/lib/utils/payment/unifiedCalculator";
import { addMonths, format } from "date-fns";

export const useUnifiedDebtData = () => {
  const { debts, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();
  
  const unifiedData = useMemo(() => {
    if (!debts || debts.length === 0) {
      return {
        payoffResults: {},
        totalDebt: 0,
        totalPaid: 0,
        projectedPayoffDate: new Date(),
        monthlyPayment: 0,
        progress: 0
      };
    }

    const monthlyPayment = profile?.monthly_payment || 0;
    const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
    
    console.log('Calculating unified debt data:', {
      numberOfDebts: debts.length,
      monthlyPayment,
      totalMinPayments,
      oneTimeFundings: oneTimeFundings.length
    });

    const payoffResults = calculateUnifiedPayoff(debts, monthlyPayment, oneTimeFundings);
    
    // Calculate total initial debt
    const totalInitialDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    
    // Find the latest payoff date
    let latestPayoffDate = new Date();
    let maxMonths = 0;
    
    Object.values(payoffResults).forEach(result => {
      if (result.months > maxMonths) {
        maxMonths = result.months;
        latestPayoffDate = result.payoffDate;
      }
    });

    // Calculate remaining balance from the latest payment data
    const currentBalances = Object.values(payoffResults).reduce((total, result) => {
      const latestPayment = result.monthlyPayments[result.monthlyPayments.length - 1];
      return total + (latestPayment?.remainingBalance || 0);
    }, 0);

    // Calculate progress
    const totalPaid = totalInitialDebt - currentBalances;
    const progress = totalInitialDebt > 0 ? (totalPaid / totalInitialDebt) * 100 : 0;

    console.log('Unified debt calculations complete:', {
      totalInitialDebt,
      currentBalances,
      totalPaid,
      progress,
      projectedPayoffDate: format(latestPayoffDate, 'MMM yyyy')
    });

    return {
      payoffResults,
      totalDebt: totalInitialDebt,
      currentBalance: currentBalances,
      totalPaid,
      projectedPayoffDate: latestPayoffDate,
      monthlyPayment,
      progress,
      totalMinPayments
    };
  }, [debts, profile?.monthly_payment, oneTimeFundings]);

  return unifiedData;
};