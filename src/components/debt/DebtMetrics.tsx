import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Calendar, 
  PieChart, 
  ArrowUpRight, 
  Info,
  CreditCard,
  TrendingUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { addMonths, format, differenceInMonths } from "date-fns";

interface DebtMetricsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtMetrics = ({ debts, currencySymbol }: DebtMetricsProps) => {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const averageInterestRate = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length
    : 0;
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  
  // Calculate projected payoff date based on minimum payments
  const calculatePayoffDate = () => {
    let remainingBalance = totalDebt;
    let months = 0;
    const monthlyRate = averageInterestRate / 1200;
    
    while (remainingBalance > 0 && months < 360) {
      const interest = remainingBalance * monthlyRate;
      remainingBalance = remainingBalance + interest - totalMinPayment;
      months++;
    }
    
    return addMonths(new Date(), months);
  };

  const payoffDate = calculatePayoffDate();
  const monthsToPayoff = differenceInMonths(payoffDate, new Date());
  const yearsToPayoff = Math.floor(monthsToPayoff / 12);
  const remainingMonths = monthsToPayoff % 12;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currencySymbol);
  };

  // Calculate monthly interest vs principal
  const monthlyInterest = totalDebt * (averageInterestRate / 1200);
  const principalPayment = totalMinPayment - monthlyInterest;
  const interestPercentage = (monthlyInterest / totalMinPayment) * 100;
  const principalPercentage = 100 - interestPercentage;

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
          <div className="space-y-6">
            {/* Current Debt-Free Date */}
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Calendar className="h-5 w-5" />
                <span className="text-lg font-semibold">Your Debt-Free Journey</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {format(payoffDate, 'MMMM yyyy')}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {yearsToPayoff > 0 && `${yearsToPayoff} years`}
                    {remainingMonths > 0 && ` ${remainingMonths} months`} until debt-free
                  </p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">{debts.length}</span>
                  <p className="text-sm text-gray-600 mt-1">Active Debts</p>
                </div>
              </div>
            </div>

            {/* Payment Efficiency */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <PieChart className="h-5 w-5" />
                  <span className="text-lg font-semibold">Payment Efficiency</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>How your monthly payment is split between interest and principal</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Principal ({principalPercentage.toFixed(1)}%)</span>
                  <span>Interest ({interestPercentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${principalPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {formatMoney(principalPayment)} goes to principal, {formatMoney(monthlyInterest)} to interest monthly
                </p>
              </div>
            </div>

            {/* Total Interest Cost */}
            <div>
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <DollarSign className="h-5 w-5" />
                <span className="text-lg font-semibold">Total Interest Cost</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Interest to Pay</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatMoney(monthlyInterest * monthsToPayoff)}
                    </span>
                  </div>
                  <Progress 
                    value={(monthlyInterest * monthsToPayoff / totalDebt) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-600 mb-3">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Optimization Tips</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  💡 Adding {formatMoney(totalMinPayment * 0.1)} to your monthly payment could save you {formatMoney(monthlyInterest * 12)} in yearly interest.
                </p>
                <p className="text-sm text-gray-700">
                  🎯 Using the Avalanche strategy could help you become debt-free faster.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};