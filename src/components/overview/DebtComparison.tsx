import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  DollarSign,
  Info,
  Clock,
  Target,
  LightbulbIcon,
  ArrowTrendingUpIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
        moneySaved: 0,
        monthlyPrincipal: 0,
        monthlyInterest: 0
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

    // Calculate monthly principal and interest payments
    const totalMonthlyPayment = profile.monthly_payment;
    const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const weightedInterestRate = debts.reduce((sum, debt) => 
      sum + (debt.balance / totalBalance) * debt.interest_rate, 0);
    
    const monthlyInterest = (totalBalance * weightedInterestRate) / 1200;
    const monthlyPrincipal = totalMonthlyPayment - monthlyInterest;
    
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
      moneySaved: originalTotalInterest - optimizedTotalInterest,
      monthlyPrincipal,
      monthlyInterest
    };
  };

  const comparison = calculateComparison();
  const payoffDate = comparison.optimizedPayoffDate;
  const now = new Date();
  const monthsUntilPayoff = 
    (payoffDate.getFullYear() - now.getFullYear()) * 12 + 
    (payoffDate.getMonth() - now.getMonth());
  const yearsLeft = Math.floor(monthsUntilPayoff / 12);
  const monthsLeft = monthsUntilPayoff % 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Your Debt-Free Journey Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Calendar className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Your Debt-Free Journey</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-4xl font-bold text-gray-900">
              {payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-gray-600 mt-2">
              {yearsLeft} years {monthsLeft} months until debt-free
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-gray-900">{comparison.totalDebts}</h3>
            <p className="text-gray-600 mt-2">Active Debts</p>
          </div>
        </div>
      </div>

      {/* Payment Efficiency Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-600">
            <Clock className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Payment Efficiency</h2>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-5 h-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This shows how your monthly payment is split between reducing your debt (principal) 
                  and paying interest charges.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={(comparison.monthlyPrincipal / (comparison.monthlyPrincipal + comparison.monthlyInterest)) * 100} 
            className="h-4"
          />
          <p className="text-sm text-gray-600">
            {currencySymbol}{Math.round(comparison.monthlyPrincipal)} goes to principal, 
            {currencySymbol}{Math.round(comparison.monthlyInterest)} to interest monthly
          </p>
        </div>
      </div>

      {/* Total Interest Cost Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <DollarSign className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Total Interest Cost</h2>
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Interest to Pay</span>
            <span className="text-3xl font-bold text-red-600">
              {currencySymbol}{Math.round(comparison.originalTotalInterest).toLocaleString()}
            </span>
          </div>
          <Progress 
            value={(comparison.optimizedTotalInterest / comparison.originalTotalInterest) * 100}
            className="h-2"
          />
        </Card>
      </div>

      {/* Optimization Tips Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <Target className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Optimization Tips</h2>
        </div>
        
        <Card className="p-6 bg-emerald-50">
          <div className="space-y-4">
            <div className="flex gap-3">
              <LightbulbIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <p className="text-gray-700">
                Adding {currencySymbol}60 to your monthly payment could save you 
                {currencySymbol}4,288 in yearly interest.
              </p>
            </div>
            <div className="flex gap-3">
              <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <p className="text-gray-700">
                Using the Avalanche strategy could help you become debt-free faster.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};