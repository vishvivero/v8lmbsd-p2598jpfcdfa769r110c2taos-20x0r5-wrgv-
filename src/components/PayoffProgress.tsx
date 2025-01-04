import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Info, TrendingUp, Calendar, DollarSign } from "lucide-react";
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
      >
        <Card className="bg-white h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">TOTAL DEBT BALANCE</CardTitle>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Current total balance</p>
              <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalDebt)}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg flex-1">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(paidAmount)}</div>
                  <div className="text-sm text-gray-600">paid off</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg flex-1">
                  <div className="text-2xl font-bold text-purple-600">{progressPercentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">progress</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-2 mb-4" />
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg mt-auto">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Payment Progress</h3>
                <p className="text-sm text-gray-600">Keep up the great work!</p>
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
        <Card className="bg-white border-purple-100 h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">DEBT-FREE COUNTDOWN</CardTitle>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            {projectedPayoffDate && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Projected debt-free date</p>
                <p className="text-lg font-semibold">
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
                        <div className="text-center p-3 bg-purple-50 rounded-lg flex-1">
                          <div className="text-2xl font-bold text-purple-600">{years}</div>
                          <div className="text-sm text-gray-600">years</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg flex-1">
                          <div className="text-2xl font-bold text-purple-600">{months}</div>
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
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg mt-auto">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Your journey to financial freedom</h3>
                <p className="text-sm text-gray-600">Stay focused on your debt-free goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};