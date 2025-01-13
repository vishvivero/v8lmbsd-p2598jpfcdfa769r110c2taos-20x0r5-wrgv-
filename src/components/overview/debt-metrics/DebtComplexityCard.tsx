import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Debt } from "@/lib/types";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface DebtComplexityCardProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtComplexityCard = ({ debts, currencySymbol }: DebtComplexityCardProps) => {
  const chartData = debts.map(debt => ({
    name: debt.name,
    balance: debt.balance
  }));

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Debt Breakdown
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Visualizes how each debt contributes to your total balance.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
              />
              <RechartsTooltip 
                formatter={(value: number) => 
                  `${currencySymbol}${value.toLocaleString()}`
                }
              />
              <Bar dataKey="balance" fill="#4f46e5" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};