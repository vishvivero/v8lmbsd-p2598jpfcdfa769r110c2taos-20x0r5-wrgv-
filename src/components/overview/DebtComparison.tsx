import { motion } from "framer-motion";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { ComparisonMetrics } from "./comparison/ComparisonMetrics";
import { ComparisonChart } from "./comparison/ComparisonChart";
import { SavingsBreakdown } from "./comparison/SavingsBreakdown";

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();
  const currencySymbol = profile?.preferred_currency || "£";

  const calculateComparison = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) {
      return {
        monthsSaved: 0,
        moneySaved: 0,
        comparisonData: []
      };
    }

    console.log('Calculating comparison with:', {
      debtsCount: debts.length,
      monthlyPayment: profile.monthly_payment,
      fundingsCount: oneTimeFundings.length
    });

    const selectedStrategy = strategies.find(s => s.id === profile.selected_strategy) || strategies[0];
    
    const formattedFundings = oneTimeFundings.map(funding => ({
      amount: funding.amount,
      payment_date: new Date(funding.payment_date)
    }));
    
    // Calculate original timeline
    const originalPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      debts.reduce((sum, debt) => sum + debt.minimum_payment, 0),
      selectedStrategy,
      []
    );

    // Calculate optimized timeline
    const optimizedPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      selectedStrategy,
      formattedFundings
    );

    // Calculate savings
    let originalLatestDate = new Date();
    let optimizedLatestDate = new Date();
    let originalTotalInterest = 0;
    let optimizedTotalInterest = 0;

    Object.values(originalPayoff).forEach(detail => {
      if (detail.payoffDate > originalLatestDate) originalLatestDate = detail.payoffDate;
      originalTotalInterest += detail.totalInterest;
    });

    Object.values(optimizedPayoff).forEach(detail => {
      if (detail.payoffDate > optimizedLatestDate) optimizedLatestDate = detail.payoffDate;
      optimizedTotalInterest += detail.totalInterest;
    });

    const monthsDiff = (originalLatestDate.getFullYear() - optimizedLatestDate.getFullYear()) * 12 +
                      (originalLatestDate.getMonth() - optimizedLatestDate.getMonth());

    // Generate comparison data for chart
    const comparisonData = generateComparisonData(originalPayoff, optimizedPayoff);

    return {
      monthsSaved: Math.max(0, monthsDiff),
      moneySaved: originalTotalInterest - optimizedTotalInterest,
      comparisonData
    };
  };

  const generateComparisonData = (originalPayoff: any, optimizedPayoff: any) => {
    // Implementation of data generation for the chart
    // This would combine the payoff schedules into a format suitable for the chart
    return [];
  };

  const { monthsSaved, moneySaved, comparisonData } = calculateComparison();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ComparisonMetrics
        monthsSaved={monthsSaved}
        moneySaved={moneySaved}
        currencySymbol={currencySymbol}
      />
      
      <ComparisonChart
        data={comparisonData}
        currencySymbol={currencySymbol}
      />
      
      <SavingsBreakdown totalSavings={moneySaved} />
    </motion.div>
  );
};
