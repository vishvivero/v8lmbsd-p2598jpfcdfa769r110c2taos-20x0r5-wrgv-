import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Coins,
  Calendar,
  ArrowDown,
  Percent,
  DollarSign,
  Award,
  Info,
  ArrowRight,
  Plane,
  Smartphone,
  Palmtree
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();
  const navigate = useNavigate();
  const currencySymbol = profile?.preferred_currency || "£";

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
  const savingsComparisons = [
    {
      icon: <Plane className="w-4 h-4" />,
      text: `${Math.floor(comparison.moneySaved / 1000)} international trips`
    },
    {
      icon: <Smartphone className="w-4 h-4" />,
      text: `${Math.floor(comparison.moneySaved / 800)} premium smartphones`
    },
    {
      icon: <Palmtree className="w-4 h-4" />,
      text: "a dream family vacation"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Calendar className="w-5 h-5 text-gray-500" />
              How Does Your Debt Look Now?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">Total Debts</span>
                </div>
                <span className="text-2xl font-semibold">{comparison.totalDebts}</span>
              </div>

              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Current Debt-Free Date</span>
                  </div>
                  <span className="text-lg font-semibold">
                    {comparison.originalPayoffDate.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Total Interest (Current Plan)</span>
                  </div>
                  <span className="text-xl font-semibold text-red-600">
                    {currencySymbol}{comparison.originalTotalInterest.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </span>
                </div>
                <Progress value={70} className="h-2 bg-gray-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimized Plan Card */}
        <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Award className="w-5 h-5" />
              What Debtfreeo Can Save You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Optimized Debt-Free Date</span>
                      <div className="text-sm text-emerald-600 font-medium">
                        {comparison.timeSaved.years > 0 && `${comparison.timeSaved.years} years`}
                        {comparison.timeSaved.months > 0 && ` ${comparison.timeSaved.months} months`} earlier!
                      </div>
                    </div>
                  </div>
                  <span className="text-lg font-semibold">
                    {comparison.optimizedPayoffDate.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-gray-600 dark:text-gray-300">Total Interest (Optimized)</span>
                  </div>
                  <span className="text-xl font-semibold text-emerald-600">
                    {currencySymbol}{comparison.optimizedTotalInterest.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </span>
                </div>
                <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <ArrowDown className="w-4 h-4" />
                    <span className="font-medium">
                      Save {currencySymbol}{comparison.moneySaved.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })} in interest!
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                  With your savings, you could get:
                </h4>
                <div className="space-y-2">
                  {savingsComparisons.map((comparison, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {comparison.icon}
                      <span>{comparison.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => navigate("/strategy")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Start Optimizing Your Debt Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
