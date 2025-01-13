import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Calendar,
  DollarSign,
  Info,
  Clock,
  Target,
  LightbulbIcon,
  TrendingUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebts } from "@/hooks/use-debts";
import { Progress } from "@/components/ui/progress";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  const navigate = useNavigate();
  const currencySymbol = profile?.preferred_currency || "£";
  const [isDebtListExpanded, setIsDebtListExpanded] = useState(false);

  const calculateComparison = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) {
      return {
        totalDebts: 0,
        originalPayoffDate: new Date(),
        monthsToPayoff: 0,
        yearsToPayoff: 0,
        principalPayment: 0,
        interestPayment: 0,
        totalInterest: 0
      };
    }

    const selectedStrategy = strategies.find(s => s.id === profile.selected_strategy) || strategies[0];
    
    const payoffDetails = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      selectedStrategy,
      []
    );

    let maxMonths = 0;
    let totalInterest = 0;

    Object.values(payoffDetails).forEach(detail => {
      if (detail.months > maxMonths) maxMonths = detail.months;
      totalInterest += detail.totalInterest;
    });

    const yearsToPayoff = Math.floor(maxMonths / 12);
    const monthsToPayoff = maxMonths % 12;

    // Calculate monthly principal and interest payments
    const totalMonthlyPayment = profile.monthly_payment || 0;
    const monthlyInterest = debts.reduce((sum, debt) => 
      sum + (debt.balance * (debt.interest_rate / 100 / 12)), 0);
    const monthlyPrincipal = totalMonthlyPayment - monthlyInterest;

    return {
      totalDebts: debts.length,
      originalPayoffDate: new Date(Date.now() + maxMonths * 30 * 24 * 60 * 60 * 1000),
      monthsToPayoff,
      yearsToPayoff,
      principalPayment: monthlyPrincipal,
      interestPayment: monthlyInterest,
      totalInterest
    };
  };

  const comparison = calculateComparison();

  return (
    <div className="space-y-8">
      {/* Debt-Free Journey Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Your Debt-Free Journey</h3>
          </div>
          <div className="text-4xl font-bold">
            {comparison.originalPayoffDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <p className="text-gray-600 text-lg">
            {comparison.yearsToPayoff} years {comparison.monthsToPayoff} months until debt-free
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700">Active Debts</h3>
          <div className="text-4xl font-bold">{comparison.totalDebts}</div>
          <p className="text-gray-600">Total active debt accounts</p>
        </div>
      </div>

      {/* Payment Efficiency Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-600">
            <Clock className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Payment Efficiency</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>How your monthly payment is split between principal and interest</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Progress value={70} className="h-2" />
        <p className="text-gray-600">
          {currencySymbol}{Math.round(comparison.principalPayment)} goes to principal, 
          {currencySymbol}{Math.round(comparison.interestPayment)} to interest monthly
        </p>
      </div>

      {/* Total Interest Cost Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <DollarSign className="h-6 w-6" />
          <h3 className="text-xl font-semibold">Total Interest Cost</h3>
        </div>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Interest to Pay</span>
            <span className="text-3xl font-bold text-red-600">
              {currencySymbol}{Math.round(comparison.totalInterest).toLocaleString()}
            </span>
          </div>
          <Progress value={85} className="h-2" />
        </Card>
      </div>

      {/* Optimization Tips Section */}
      <div className="space-y-4 bg-green-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="h-6 w-6" />
          <h3 className="text-xl font-semibold">Optimization Tips</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <LightbulbIcon className="h-6 w-6 text-yellow-500 mt-1" />
            <p className="text-gray-700">
              Adding {currencySymbol}60 to your monthly payment could save you
              {currencySymbol}4,288 in yearly interest.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-6 w-6 text-red-500 mt-1" />
            <p className="text-gray-700">
              Using the Avalanche strategy could help you become debt-free faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};