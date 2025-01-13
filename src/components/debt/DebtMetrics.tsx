import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { Coins, Calendar, Info, Target, ArrowUp, PiggyBank, ChevronRight } from "lucide-react";
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
            <div>
              <h2 className="text-2xl font-semibold text-[#2F855A] flex items-center gap-2 mb-2">
                <Target className="w-6 h-6" />
                Your Debt-Free Journey
              </h2>
              <p className="text-sm text-gray-600">See how DebtFree.O can transform your financial future</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Without DebtFree.O</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Debt-Free Date</span>
                  <span className="font-semibold text-red-600">Oct 2027</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-red-600">
                    {formatMoney(averageInterestRate * totalDebt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F2FCE2] rounded-lg border border-[#34D399]/20">
              <h3 className="font-medium text-[#107A57] mb-3">With DebtFree.O</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#107A57]">New Debt-Free Date</span>
                  <span className="font-semibold text-[#107A57]">Mar 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#107A57]">Reduced Interest</span>
                  <span className="font-semibold text-[#107A57]">
                    {formatMoney(averageInterestRate * totalDebt * 0.7)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F0FDF4] rounded-lg border border-[#34D399]">
              <div className="flex items-center gap-2 mb-3">
                <PiggyBank className="w-5 h-5 text-[#107A57]" />
                <h3 className="font-medium text-[#107A57]">Your Potential Savings</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#107A57]">Time Saved</span>
                  <span className="font-semibold text-[#107A57]">19 months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#107A57]">Money Saved</span>
                  <span className="font-semibold text-[#107A57]">
                    {formatMoney(averageInterestRate * totalDebt * 0.3)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};