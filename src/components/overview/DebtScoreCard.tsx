import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebts } from "@/hooks/use-debts";
import { DebtComparison } from "./DebtComparison";
import { calculateDebtScore, getScoreCategory } from "@/lib/utils/scoring/debtScoreCalculator";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { NoDebtsMessage } from "@/components/debt/NoDebtsMessage";

export const DebtScoreCard = () => {
  const { debts, profile } = useDebts();
  
  console.log('Rendering DebtScoreCard with debts:', {
    debtCount: debts?.length,
    totalBalance: debts?.reduce((sum, debt) => sum + debt.balance, 0),
  });

  // Calculate total debt
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  
  const hasNoDebts = !debts || debts.length === 0;
  const isDebtFree = debts && debts.length > 0 && totalDebt === 0;
  
  // Calculate debt score only if there are active debts
  const calculateScore = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) return null;

    const selectedStrategy = strategies.find(s => s.id === profile?.selected_strategy) || strategies[0];
    
    const originalPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      debts.reduce((sum, debt) => sum + debt.minimum_payment, 0),
      selectedStrategy,
      []
    );

    const optimizedPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      selectedStrategy,
      []
    );

    return calculateDebtScore(
      debts,
      originalPayoff,
      optimizedPayoff,
      selectedStrategy,
      profile.monthly_payment
    );
  };

  const scoreDetails = calculateScore();
  const scoreCategory = scoreDetails ? getScoreCategory(scoreDetails.totalScore) : null;

  const renderCircularProgress = () => {
    if (!scoreDetails) return null;

    return (
      <div className="relative w-64 h-64"> {/* Increased from w-48 h-48 to w-64 h-64 */}
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <circle
            cx="128" // Increased from 96 to 128
            cy="128" // Increased from 96 to 128
            r="116" // Increased from 88 to 116
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-gray-100"
          />
          <motion.circle
            initial={{ strokeDashoffset: 729 }} // Increased from 553 to 729 (2 * PI * 116)
            animate={{ 
              strokeDashoffset: 729 - (729 * scoreDetails.totalScore) / 100 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx="128" // Increased from 96 to 128
            cy="128" // Increased from 96 to 128
            r="116" // Increased from 88 to 116
            stroke="url(#scoreGradient)"
            strokeWidth="16"
            fill="none"
            strokeDasharray="729" // Increased from 553 to 729
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-6xl font-bold text-gray-900"> {/* Increased from text-5xl to text-6xl */}
            {Math.round(scoreDetails.totalScore)}
          </div>
          <div className="text-emerald-500 font-medium text-lg"> {/* Added text-lg */}
            {scoreCategory?.label}
          </div>
        </div>
      </div>
    );
  };

  const renderScoreBreakdown = () => {
    if (!scoreDetails) return null;

    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Your debt repayment plan is fully optimized for interest and duration savings.
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/50 rounded-lg">
            <div className="text-gray-600">Interest Savings</div>
            <div className="text-lg font-semibold text-emerald-600">
              {scoreDetails.interestScore.toFixed(1)}/50
            </div>
          </div>
          <div className="p-4 bg-blue-50/50 rounded-lg">
            <div className="text-gray-600">Duration Reduction</div>
            <div className="text-lg font-semibold text-blue-600">
              {scoreDetails.durationScore.toFixed(1)}/30
            </div>
          </div>
          <div className="p-4 bg-purple-50/50 rounded-lg">
            <div className="text-gray-600">Payment Behavior</div>
            <div className="text-lg font-semibold text-purple-600">
              {(scoreDetails.behaviorScore.ontimePayments + 
                scoreDetails.behaviorScore.excessPayments + 
                scoreDetails.behaviorScore.strategyUsage).toFixed(1)}/20
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (hasNoDebts) {
      return <NoDebtsMessage />;
    }

    if (isDebtFree) {
      return (
        <div className="text-center space-y-6 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-emerald-50 rounded-full"
          >
            <div className="w-12 h-12 text-emerald-600">🎉</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-emerald-600">
              Congratulations! You're Debt-Free!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              You've achieved financial freedom! Keep up the great work and consider your next financial goals.
            </p>
          </motion.div>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-emerald-700">YOUR DEBT SCORE</h2>
            <p className="text-gray-600 mt-1">Track your progress to debt freedom</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-5 h-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Your debt score is calculated based on interest savings, duration reduction, 
                  and payment behavior. A higher score means you're optimizing your debt payoff journey.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            {renderCircularProgress()}
          </div>
          <div className="flex-grow">
            {renderScoreBreakdown()}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <DebtComparison />
        </div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-white p-6 relative overflow-hidden">
        {renderContent()}
      </Card>
    </motion.div>
  );
};