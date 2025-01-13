import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { Coins, Calendar, Info, Target, ArrowUp, PiggyBank } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface DebtMetricsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtMetrics = ({ debts, currencySymbol }: DebtMetricsProps) => {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const averageInterestRate = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length
    : 0;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currencySymbol);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="p-6 bg-white shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#2F855A]">TOTAL DEBT BALANCE</h2>
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
              <Coins className="w-6 h-6 text-[#34D399]" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">Current total debt</p>
            <p className="text-4xl font-bold">{formatMoney(totalDebt)}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                  <span className="text-[#34D399]">👍</span>
                </div>
                <span className="text-gray-600">Total Paid Off</span>
              </div>
              <span className="font-semibold">{formatMoney(0)}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                  <span className="text-[#34D399]">⭕</span>
                </div>
                <span className="text-gray-600">Remaining Balance</span>
              </div>
              <span className="font-semibold">{formatMoney(totalDebt)}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                  <span className="text-[#34D399]">%</span>
                </div>
                <span className="text-gray-600">Progress</span>
              </div>
              <span className="font-semibold">0.0% Complete</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#2F855A] flex items-center gap-2">
              <Target className="w-6 h-6" />
              Your Debt-Free Journey
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Total Debts</span>
              </div>
              <span className="text-xl font-semibold">{debts.length}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Debt-Free Date</span>
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
              <span className="text-xl font-semibold">Oct 2027</span>
            </div>
          </div>

          <div className="p-4 bg-[#F2FCE2] rounded-lg border border-[#34D399]/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="w-4 h-4 text-[#107A57]" />
              <span className="text-[#107A57] font-medium">Potential savings:</span>
            </div>
            <span className="text-2xl font-bold text-[#107A57]">
              {formatMoney(averageInterestRate * totalDebt)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Interest (Original Plan)</span>
              <span className="font-semibold text-red-600">
                {formatMoney(averageInterestRate * totalDebt)}
              </span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
};