import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Award } from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import { calculateDebtScore, getScoreCategory } from "@/lib/utils/scoring/debtScoreCalculator";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";

export const ScoreInsightsSection = () => {
  const { debts, profile } = useDebts();

  if (!debts || debts.length === 0 || !profile?.monthly_payment) {
    return null;
  }

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

  const scoreDetails = calculateDebtScore(
    debts,
    originalPayoff,
    optimizedPayoff,
    selectedStrategy,
    profile.monthly_payment
  );

  const scoreCategory = getScoreCategory(scoreDetails.totalScore);

  const getRecommendation = () => {
    if (scoreDetails.interestScore < 25) {
      return "Consider increasing your monthly payment to reduce interest costs.";
    } else if (scoreDetails.durationScore < 15) {
      return "You could pay off your debt faster by optimizing your payment strategy.";
    } else if (scoreDetails.behaviorScore.ontimePayments < 5) {
      return "Set up automatic payments to maintain consistency.";
    }
    return "Keep up the great work! Your debt management strategy is solid.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Score Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="364.425"
                  strokeDashoffset={364.425 - (364.425 * scoreDetails.totalScore) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round(scoreDetails.totalScore)}
                </div>
                <div className={`text-sm font-medium ${scoreCategory.color}`}>
                  {scoreCategory.label}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Interest Optimization</span>
                <span className="font-medium">{scoreDetails.interestScore.toFixed(1)}/50</span>
              </div>
              <Progress value={(scoreDetails.interestScore / 50) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Efficiency</span>
                <span className="font-medium">{scoreDetails.durationScore.toFixed(1)}/30</span>
              </div>
              <Progress value={(scoreDetails.durationScore / 30) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Financial Behavior</span>
                <span className="font-medium">
                  {(
                    scoreDetails.behaviorScore.ontimePayments +
                    scoreDetails.behaviorScore.excessPayments +
                    scoreDetails.behaviorScore.strategyUsage
                  ).toFixed(1)}/20
                </span>
              </div>
              <Progress 
                value={
                  ((scoreDetails.behaviorScore.ontimePayments +
                    scoreDetails.behaviorScore.excessPayments +
                    scoreDetails.behaviorScore.strategyUsage) / 20) * 100
                } 
                className="h-2" 
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Recommendation</h4>
                <p className="text-sm text-gray-600 mt-1">{getRecommendation()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};