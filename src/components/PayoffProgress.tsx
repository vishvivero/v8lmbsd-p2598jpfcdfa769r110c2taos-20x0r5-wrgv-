import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sun, Info } from "lucide-react";
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
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                Balance after bills
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your remaining balance after all bills are paid</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="text-2xl font-bold">{formatCurrency(totalDebt)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account balance</span>
                <span>{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Upcoming bills</span>
                <span>{formatCurrency(50)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Upcoming income</span>
                <span>{formatCurrency(600)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-500"
                >
                  <path d="M6 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                  <path d="M6 12V2h12v20" />
                  <path d="M18 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                  <path d="M12 12h6" />
                </svg>
              </div>
              <div className="flex justify-between items-center flex-1">
                <span className="text-sm font-medium">Bills with score impact</span>
                <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {projectedPayoffDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#004d61] text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>DEBT-FREE COUNTDOWN</span>
                <Sun className="h-6 w-6 text-yellow-400" />
              </CardTitle>
              <p className="text-sm text-gray-200">
                {projectedPayoffDate.toLocaleDateString('en-US', { 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8 items-center">
                {(() => {
                  const { years, months } = getYearsAndMonths(projectedPayoffDate);
                  return (
                    <>
                      <div className="text-center">
                        <div className="text-4xl font-bold">{years}</div>
                        <div className="text-sm text-gray-200">years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold">{months}</div>
                        <div className="text-sm text-gray-200">months</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};