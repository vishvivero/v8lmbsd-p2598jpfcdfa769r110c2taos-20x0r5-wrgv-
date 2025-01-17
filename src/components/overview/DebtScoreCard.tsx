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

  // Calculate a personalized tip based on the user's debt score
  const getPersonalizedTip = () => {
    if (!scoreDetails) return null;
    
    if (scoreDetails.totalScore < 50) {
      return "Increasing your monthly payment by just 10% could significantly improve your score!";
    } else if (scoreDetails.totalScore < 75) {
      return "You're doing great! Consider redirecting any windfalls to your highest-interest debt.";
    } else {
      return "Excellent progress! Keep maintaining your current strategy for optimal results.";
    }
  };

  const renderCircularProgress = () => {
    if (!scoreDetails) return null;

    return (
      <div className="relative w-64 h-64">
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
            cx="128"
            cy="128"
            r="116"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-gray-100"
          />
          <motion.circle
            initial={{ strokeDashoffset: 729 }}
            animate={{ 
              strokeDashoffset: 729 - (729 * scoreDetails.totalScore) / 100 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx="128"
            cy="128"
            r="116"
            stroke="url(#scoreGradient)"
            strokeWidth="16"
            fill="none"
            strokeDasharray="729"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-6xl font-bold text-gray-900">
            {Math.round(scoreDetails.totalScore)}
          </div>
          <div className="text-emerald-500 font-medium text-lg">
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
        <div className="space-y-6">
          {/* Personalized Greeting Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left space-y-2"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Hi {profile?.email?.split('@')[0] || 'there'}, here's how you're doing today!
            </h2>
            <p className="text-gray-600 text-lg">
              Every step forward brings you closer to financial freedom.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Score Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <Card className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                {renderCircularProgress()}
              </Card>
            </motion.div>

            {/* Quick Tip Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-blue-50/30 border-blue-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-blue-900">Quick Tip for You</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-blue-400" />
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right" 
                          className="z-[60] bg-white border-gray-200 shadow-lg"
                        >
                          <p>Personalized tip based on your current debt management strategy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-blue-800">
                    {getPersonalizedTip()}
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="mt-8">
          {renderScoreBreakdown()}
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