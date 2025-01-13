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

export const DebtScoreCard = () => {
  const { debts, profile } = useDebts();
  
  // Get currency symbol from profile, default to £ if not set
  const currencySymbol = profile?.preferred_currency || "£";
  
  // Calculate total debt
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  
  // Calculate debt score
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
  
  // Calculate the stroke dash offset for the progress circle
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((scoreDetails?.totalScore || 0) / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-white p-6 relative overflow-hidden">
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

        <div className="flex items-center justify-between mb-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-5xl font-bold text-gray-800">
                {Math.round(scoreDetails?.totalScore || 0)}
              </div>
              <div className={`text-lg font-medium ${scoreCategory?.color}`}>
                {scoreCategory?.label}
              </div>
            </div>
          </div>

          {scoreDetails && (
            <div className="flex-1 ml-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {scoreCategory?.description}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Interest Savings</div>
                    <div className="text-lg font-semibold text-emerald-600">
                      {scoreDetails.interestScore.toFixed(1)}/50
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Duration Reduction</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {scoreDetails.durationScore.toFixed(1)}/30
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Payment Behavior</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {(
                        scoreDetails.behaviorScore.ontimePayments +
                        scoreDetails.behaviorScore.excessPayments +
                        scoreDetails.behaviorScore.strategyUsage
                      ).toFixed(1)}/20
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <DebtComparison />
        </div>
      </Card>
    </motion.div>
  );
};