import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, DollarSign, Clock, Gift } from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";

const SAVINGS_SUGGESTIONS = [
  { item: "International Trip", averageCost: 3000 },
  { item: "New Smartphone", averageCost: 1000 },
  { item: "Home Renovation", averageCost: 5000 },
  { item: "Investment Portfolio", averageCost: 2000 }
];

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#107A57]">How does your debt look now?</CardTitle>
            <div className="w-10 h-10 bg-[#34D399]/10 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[#34D399]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Total Debts</span>
            <span className="font-semibold">{comparison.totalDebts}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Original Debt-Free Date</span>
            <span className="font-semibold">
              {comparison.originalPayoffDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Total Interest (Original Plan)</span>
            <span className="font-semibold text-red-600">
              {currencySymbol}{comparison.originalTotalInterest.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#107A57]">What DebtFreeo can save you</CardTitle>
            <div className="w-10 h-10 bg-[#34D399]/10 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#34D399]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">New Debt-Free Date</span>
            <span className="font-semibold text-green-600">
              {comparison.optimizedPayoffDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Time Saved</span>
            <span className="font-semibold text-green-600">
              {comparison.timeSaved.years > 0 && `${comparison.timeSaved.years} years `}
              {comparison.timeSaved.months > 0 && `${comparison.timeSaved.months} months`}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Money Saved</span>
            <span className="font-semibold text-green-600">
              {currencySymbol}{comparison.moneySaved.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700 mb-2">What you could do with your savings:</h4>
            <ul className="space-y-2">
              {getSavingsSuggestions(comparison.moneySaved).map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-500" />
                  {suggestion.quantity}x {suggestion.item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};