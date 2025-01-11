import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { Coins, Calendar, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              <Coins className="w-6 h-6" />
              Your Debt Snapshot
            </h2>
            <div className="text-[#34D399]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L3 3M21 3L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Total Debts</span>
              </div>
              <span className="font-semibold">{debts.length}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
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
              <span className="font-semibold">October 2027</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Interest (Original Plan)</span>
                <span className="font-semibold text-red-600">{formatMoney(averageInterestRate * totalDebt)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#34D399] h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};