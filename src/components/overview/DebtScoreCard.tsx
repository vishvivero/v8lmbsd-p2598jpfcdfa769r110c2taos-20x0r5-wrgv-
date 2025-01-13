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
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { strategies } from "@/lib/strategies";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";

export const DebtScoreCard = () => {
  const { debts, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();
  
  // Get currency symbol from profile, default to £ if not set
  const currencySymbol = profile?.preferred_currency || "£";
  
  // Calculate total debt and paid amounts
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  const maxScore = 999;
  const currentScore = Math.max(0, Math.min(maxScore - Math.floor(totalDebt / 1000), maxScore));
  const scorePercentage = (currentScore / maxScore) * 100;
  
  // Calculate savings data
  const calculateSavings = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) {
      return {
        moneySaved: 0,
        timeSaved: { years: 0, months: 0 }
      };
    }

    const selectedStrategy = strategies.find(s => s.id === profile.selected_strategy) || strategies[0];
    
    const originalPayoff = calculatePayoffDetails(
      debts,
      debts.reduce((sum, debt) => sum + debt.minimum_payment, 0),
      selectedStrategy,
      []
    );

    const optimizedPayoff = calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      selectedStrategy,
      oneTimeFundings
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
      moneySaved: originalTotalInterest - optimizedTotalInterest,
      timeSaved: {
        years: Math.floor(Math.max(0, monthsDiff) / 12),
        months: Math.max(0, monthsDiff) % 12
      }
    };
  };

  const savings = calculateSavings();
  
  // Calculate the stroke dash offset for the progress circle
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scorePercentage / 100) * circumference;
  
  const gradientColors = {
    0: "#EF4444",    // Red for low scores
    25: "#F97316",   // Orange for below average
    50: "#FACC15",   // Yellow for average
    75: "#34D399",   // Green for good
    100: "#10B981",  // Emerald for excellent
  };

  const savingsComparisons = [
    {
      icon: "✈️",
      text: `${Math.floor(savings.moneySaved / 1000)} international trips`
    },
    {
      icon: "📱",
      text: `${Math.floor(savings.moneySaved / 800)} premium smartphones`
    },
    {
      icon: "🌴",
      text: "a dream family vacation"
    }
  ];

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
                <p>Your debt score is calculated based on your total debt amount</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center justify-between">
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
                  <stop offset="0%" stopColor={gradientColors[0]} />
                  <stop offset="25%" stopColor={gradientColors[25]} />
                  <stop offset="50%" stopColor={gradientColors[50]} />
                  <stop offset="75%" stopColor={gradientColors[75]} />
                  <stop offset="100%" stopColor={gradientColors[100]} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-5xl font-bold text-gray-800">{currentScore}</div>
              <div className="text-gray-500">out of {maxScore}</div>
            </div>
          </div>

          <div className="flex-1 ml-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  What Debtfreeo Can Save You
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Time Saved:</span>
                      <span className="font-semibold text-emerald-600">
                        {savings.timeSaved.years > 0 && `${savings.timeSaved.years} years`}
                        {savings.timeSaved.months > 0 && ` ${savings.timeSaved.months} months`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Money Saved:</span>
                      <span className="font-semibold text-emerald-600">
                        {currencySymbol}{savings.moneySaved.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      With your savings, you could get:
                    </h4>
                    <div className="space-y-2">
                      {savingsComparisons.map((comparison, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{comparison.icon}</span>
                          <span>{comparison.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};