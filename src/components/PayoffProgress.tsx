import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Info, AlertTriangle, TrendingUp, ThumbsUp, ArrowUpDown } from "lucide-react";
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
                Total Debt Balance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current total debt across all accounts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Paid Off</span>
                <span className="text-green-600">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Balance</span>
                <span className="text-red-600">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>{progressPercentage.toFixed(1)}% Complete</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="flex justify-between items-center flex-1">
                <span className="text-sm font-medium">Payment Progress</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  On Track
                </span>
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
        <Card className="bg-white border-purple-100">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Credit report insights</CardTitle>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/5b3ba66c-4084-4bc4-bf1c-74d460522371.png" 
                  alt="Profile" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-lg font-semibold">3</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-lg font-semibold">1</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                <span className="text-lg font-semibold">4</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowUpDown className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Your top recommendation</h3>
                <p className="text-sm text-gray-600">See your next best action</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};