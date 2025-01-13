import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Debt } from "@/lib/types";

interface DebtIntensityCardProps {
  debts: Debt[];
  totalDebt: number;
  totalInterest: number;
  monthsToPayoff: number;
}

export const DebtIntensityCard = ({ debts, totalDebt, totalInterest, monthsToPayoff }: DebtIntensityCardProps) => {
  const calculateIntensityScore = () => {
    if (!debts.length) return 0;

    const MAX_DURATION = 360; // 30 years
    const debtCountWeight = 0.2;
    const durationWeight = 0.3;
    const interestRatioWeight = 0.5;

    const debtCountScore = Math.min((debts.length / 10) * 100, 100) * debtCountWeight;
    const durationScore = (monthsToPayoff / MAX_DURATION) * 100 * durationWeight;
    const interestRatioScore = Math.min((totalInterest / totalDebt) * 100, 100) * interestRatioWeight;

    return Math.min(debtCountScore + durationScore + interestRatioScore, 100);
  };

  const intensityScore = calculateIntensityScore();
  const getIntensityColor = (score: number) => {
    if (score < 40) return "text-green-500";
    if (score < 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Debt Intensity Score
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This score reflects your overall debt burden based on total debt,
                  duration, interest, and number of debts.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${getIntensityColor(intensityScore)}`}>
              {Math.round(intensityScore)}
            </span>
            <span className="text-sm text-gray-500">
              {intensityScore < 40 ? "Low Intensity" : 
               intensityScore < 70 ? "Medium Intensity" : 
               "High Intensity"}
            </span>
          </div>
          <Progress 
            value={intensityScore} 
            className="h-2"
            indicatorClassName={`${getIntensityColor(intensityScore)}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};