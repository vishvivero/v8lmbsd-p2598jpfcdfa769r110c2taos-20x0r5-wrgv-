import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress as ProgressBar } from "@/components/ui/progress";

interface DebtProgressCardProps {
  totalDebt: number;
  remainingDebt: number;
  currencySymbol: string;
}

export const DebtProgressCard = ({ totalDebt, remainingDebt, currencySymbol }: DebtProgressCardProps) => {
  const progressPercentage = ((totalDebt - remainingDebt) / totalDebt) * 100;

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Progress className="w-5 h-5" />
          Progress Tracker
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Shows your progress in paying off your total debt.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProgressBar value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Paid: {currencySymbol}{(totalDebt - remainingDebt).toLocaleString()}</span>
            <span>Remaining: {currencySymbol}{remainingDebt.toLocaleString()}</span>
          </div>
          <div className="text-center text-lg font-semibold text-emerald-600">
            {progressPercentage.toFixed(1)}% Complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};