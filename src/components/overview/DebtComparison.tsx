import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Gift, 
  Info,
  ChevronRight,
  Smartphone,
  Utensils,
  Plane,
  PiggyBank,
  Calendar,
  Coins,
  ArrowUp,
  Target
} from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SAVINGS_SUGGESTIONS = [
  { item: "International Trip", icon: Plane, averageCost: 3000 },
  { item: "New Smartphone", icon: Smartphone, averageCost: 1000 },
  { item: "Family Dinners Out", icon: Utensils, averageCost: 200 }
];

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();
  const navigate = useNavigate();

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
    
    // Convert oneTimeFundings to the correct format with Date objects
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

    // Find latest payoff dates and total interest
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

    // Calculate time saved
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

  const getSavingsSuggestions = (amount: number) => {
    return SAVINGS_SUGGESTIONS.map(suggestion => ({
      ...suggestion,
      quantity: Math.floor(amount / suggestion.averageCost)
    })).filter(s => s.quantity > 0);
  };

  const handleExploreMore = () => {
    navigate('/strategy');
  };

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg overflow-hidden">
          <div className="bg-[#34D399]/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#107A57]" />
                <CardTitle className="text-lg text-[#107A57]">Your Debt-Free Journey at a Glance</CardTitle>
              </div>
              <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#34D399]" />
              </div>
            </div>
          </div>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Debt Snapshot Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#107A57] flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Current Status
                </h3>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Total Debts
                  </span>
                  <span className="font-semibold">{comparison.totalDebts}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
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
              </div>

              {/* Potential Savings Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#107A57] flex items-center gap-2">
                  <PiggyBank className="w-4 h-4" />
                  Projected Improvements
                </h3>
                <div className="p-4 bg-[#F2FCE2] rounded-lg border border-[#34D399]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUp className="w-4 h-4 text-[#107A57]" />
                    <span className="text-[#107A57] font-medium">Potential savings:</span>
                  </div>
                  <span className="text-2xl font-bold text-[#107A57]">
                    {currencySymbol}{comparison.moneySaved.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">New Debt-Free Date</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {comparison.optimizedPayoffDate.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-gray-600">Time Saved</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {comparison.timeSaved.years > 0 && `${comparison.timeSaved.years} years `}
                    {comparison.timeSaved.months > 0 && `${comparison.timeSaved.months} months`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
              <h4 className="font-medium text-[#107A57] mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                What you could do with your savings:
              </h4>
              <div className="space-y-3">
                {getSavingsSuggestions(comparison.moneySaved).map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-[#34D399]/10 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#34D399]" />
                      </div>
                      <span>{suggestion.quantity}x {suggestion.item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={handleExploreMore}
              className="w-full bg-[#34D399] hover:bg-[#34D399]/90 text-white"
            >
              <span>Explore More Savings</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
