import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Info } from "lucide-react";
import { Debt } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DebtSnapshotProps {
  debts: Debt[] | null;
  currencySymbol: string;
}

export const DebtSnapshot = ({ debts, currencySymbol }: DebtSnapshotProps) => {
  const totalInterest = debts?.reduce((sum, debt) => {
    const monthlyInterest = (debt.balance * (debt.interest_rate / 100)) / 12;
    return sum + (monthlyInterest * 12); // Approximate yearly interest
  }, 0) ?? 0;

  const averageInterestRate = debts?.reduce((sum, debt) => sum + debt.interest_rate, 0) ?? 0;
  const numberOfDebts = debts?.length ?? 0;
  const avgInterestRate = numberOfDebts > 0 ? (averageInterestRate / numberOfDebts).toFixed(1) : "0";

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#107A57] flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Your Debt Snapshot
          </CardTitle>
          <div className="w-10 h-10 bg-[#34D399]/10 rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-[#34D399]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Debts</div>
            <div className="text-2xl font-bold text-gray-900">{numberOfDebts}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    Avg Interest Rate
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average interest rate across all your debts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-2xl font-bold text-gray-900">{avgInterestRate}%</div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Yearly Interest Cost
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated yearly interest cost based on current balances</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-2xl font-bold text-red-600">
            {currencySymbol}{totalInterest.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};