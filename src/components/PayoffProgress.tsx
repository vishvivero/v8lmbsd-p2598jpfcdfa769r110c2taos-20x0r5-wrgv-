import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Info, AlertTriangle, TrendingUp, ThumbsUp, ArrowUpDown, Calendar, CircleDollarSign, MinusCircle, PercentIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { Debt } from "@/lib/types";

interface PayoffProgressProps {
  totalDebt: number;
  paidAmount: number;
  currencySymbol: string;
  projectedPayoffDate?: Date;
  debts?: Debt[];
  monthlyPayment?: number;
}

export const PayoffProgress = ({ 
  totalDebt, 
  paidAmount, 
  currencySymbol, 
  projectedPayoffDate,
  debts = [],
  monthlyPayment = 0
}: PayoffProgressProps) => {
  const progressPercentage = totalDebt > 0 ? (paidAmount / (paidAmount + totalDebt)) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Calculate the actual projected payoff date based on debts and monthly payment
  const calculateProjectedPayoffDate = () => {
    if (!debts.length || !monthlyPayment) return projectedPayoffDate;

    // Calculate payoff details for all debts
    const payoffDetails = calculatePayoffDetails(debts, monthlyPayment, { name: 'avalanche' });
    
    // Find the debt that will take the longest to pay off
    let maxMonths = 0;
    Object.values(payoffDetails).forEach(detail => {
      if (detail.months > maxMonths) {
        maxMonths = detail.months;
      }
    });

    // Calculate the projected date
    const date = new Date();
    date.setMonth(date.getMonth() + maxMonths);
    return date;
  };

  const actualProjectedDate = calculateProjectedPayoffDate() || projectedPayoffDate;

  const getYearsAndMonths = (date: Date) => {
    if (!date) return { years: 0, months: 0 };
    
    const now = new Date();
    const diffInMonths = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)); // Using average month length
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    // Ensure we don't show negative values
    return {
      years: Math.max(0, years),
      months: Math.max(0, months)
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="h-full bg-white shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-[#107A57]">TOTAL DEBT BALANCE</CardTitle>
              <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
                <CircleDollarSign className="w-6 h-6 text-[#34D399]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Current total debt</p>
              <p className="text-2xl font-bold text-[#111827]">{formatCurrency(totalDebt)}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#34D399]/10 rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <span className="text-gray-600">Total Paid Off</span>
                </div>
                <span className="text-[#111827]">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#34D399]/10 rounded-lg">
                    <MinusCircle className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <span className="text-gray-600">Remaining Balance</span>
                </div>
                <span className="text-[#111827]">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#34D399]/10 rounded-lg">
                    <PercentIcon className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <span className="text-gray-600">Progress</span>
                </div>
                <span className="text-[#111827]">{progressPercentage.toFixed(1)}% Complete</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-gray-100" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full bg-white shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-[#107A57]">DEBT-FREE COUNTDOWN</CardTitle>
              <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#34D399]" />
              </div>
            </div>
            {actualProjectedDate && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Projected debt-free date</p>
                <p className="text-lg font-semibold text-[#111827]">
                  {actualProjectedDate.toLocaleDateString('en-US', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <div className="flex items-center gap-6 mt-4">
                  {(() => {
                    const { years, months } = getYearsAndMonths(actualProjectedDate);
                    return (
                      <>
                        <div className="text-center p-3 bg-[#E5E7EB] rounded-lg flex-1">
                          <div className="text-2xl font-bold text-[#111827]">{years}</div>
                          <div className="text-sm text-gray-600">years</div>
                        </div>
                        <div className="text-center p-3 bg-[#E5E7EB] rounded-lg flex-1">
                          <div className="text-2xl font-bold text-[#111827]">{months}</div>
                          <div className="text-sm text-gray-600">months</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-[#E5E7EB] rounded-lg">
              <div className="p-2 bg-[#34D399]/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#34D399]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[#107A57]">Your journey to financial freedom</h3>
                <p className="text-sm text-gray-600">Stay focused on your debt-free goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};