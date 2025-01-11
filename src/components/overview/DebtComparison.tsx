import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Coins,
  Calendar,
  Info,
} from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();

  const calculateComparison = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) {
      return {
        totalDebts: 0,
        originalPayoffDate: new Date(),
        originalTotalInterest: 0,
        optimizedPayoffDate: new Date(),
        optimizedTotalInterest: 0,
        timeSaved: { years: 0, months: 0 },
        moneySaved: 0
      };
    }

    const selectedStrategy = strategies.find(s => s.id === profile.selected_strategy) || strategies[0];
    
    const formattedFundings = oneTimeFundings.map(funding => ({
      amount: funding.amount,
      payment_date: new Date(funding.payment_date)
    }));
    
    // Calculate original payoff (minimum payments only)
    const originalPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      debts.reduce((sum, debt) => sum + debt.minimum_payment, 0),
      selectedStrategy,
      []
    );

    // Calculate optimized payoff (with strategy and extra payments)
    const optimizedPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      selectedStrategy,
      formattedFundings
    );

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
    
    return {
      totalDebts: debts.length,
      originalPayoffDate: originalLatestDate,
      originalTotalInterest,
      optimizedPayoffDate: optimizedLatestDate,
      optimizedTotalInterest,
      timeSaved: {
        years: Math.floor(Math.max(0, monthsDiff) / 12),
        months: Math.max(0, monthsDiff) % 12
      },
      moneySaved: originalTotalInterest - optimizedTotalInterest
    };
  };

  const comparison = calculateComparison();
  const currencySymbol = profile?.preferred_currency || '£';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-[#107A57]">YOUR DEBT SNAPSHOT</CardTitle>
            <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-[#34D399]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#E5E7EB] rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Total Debts
            </span>
            <span className="font-semibold">{comparison.totalDebts}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#E5E7EB] rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-gray-600">Original Debt-Free Date</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Calculated based on minimum payments only</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-semibold">
              {comparison.originalPayoffDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>

          <div className="p-4 bg-[#E5E7EB] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Interest (Original Plan)</span>
              <span className="font-semibold text-red-600">
                {currencySymbol}{comparison.originalTotalInterest.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};