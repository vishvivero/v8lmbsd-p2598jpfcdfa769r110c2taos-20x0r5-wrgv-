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

interface PayoffProgressProps {
  totalDebt: number;
  paidAmount: number;
  currencySymbol: string;
  projectedPayoffDate?: Date;
}

export const PayoffProgress = ({ totalDebt, paidAmount, currencySymbol, projectedPayoffDate }: PayoffProgressProps) => {
  const progressPercentage = totalDebt > 0 ? (paidAmount / (paidAmount + totalDebt)) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const getYearsAndMonths = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { years, months };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="h-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">TOTAL DEBT BALANCE</CardTitle>
              <div className="w-12 h-12 bg-[#D6BCFA]/20 rounded-full flex items-center justify-center">
                <CircleDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/80">Current total debt</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalDebt)}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#D6BCFA]/20 rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80">Total Paid Off</span>
                </div>
                <span className="text-white">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#D6BCFA]/20 rounded-lg">
                    <MinusCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80">Remaining Balance</span>
                </div>
                <span className="text-white">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#D6BCFA]/20 rounded-lg">
                    <PercentIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80">Progress</span>
                </div>
                <span className="text-white">{progressPercentage.toFixed(1)}% Complete</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#D6BCFA]/20" />
            <div className="flex items-center gap-3 p-4 bg-[#D6BCFA]/20 rounded-lg mt-auto">
              <div className="p-2 bg-[#D6BCFA]/30 rounded-lg">
                <ArrowUpDown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Payment Progress</h3>
                <p className="text-sm text-white/80">You're on track with your payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">DEBT-FREE COUNTDOWN</CardTitle>
              <div className="w-12 h-12 bg-[#D6BCFA]/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            {projectedPayoffDate && (
              <div className="mt-4">
                <p className="text-sm text-white/80">Projected debt-free date</p>
                <p className="text-lg font-semibold text-white">
                  {projectedPayoffDate.toLocaleDateString('en-US', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <div className="flex items-center gap-6 mt-4">
                  {(() => {
                    const { years, months } = getYearsAndMonths(projectedPayoffDate);
                    return (
                      <>
                        <div className="text-center p-3 bg-[#D6BCFA]/20 rounded-lg flex-1">
                          <div className="text-2xl font-bold text-white">{years}</div>
                          <div className="text-sm text-white/80">years</div>
                        </div>
                        <div className="text-center p-3 bg-[#D6BCFA]/20 rounded-lg flex-1">
                          <div className="text-2xl font-bold text-white">{months}</div>
                          <div className="text-sm text-white/80">months</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-[#D6BCFA]/20 rounded-lg">
              <div className="p-2 bg-[#D6BCFA]/30 rounded-lg">
                <ArrowUpDown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Your journey to financial freedom</h3>
                <p className="text-sm text-white/80">Stay focused on your debt-free goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};