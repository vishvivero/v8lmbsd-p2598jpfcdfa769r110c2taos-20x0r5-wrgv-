import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleDollarSign, ThumbsUp, MinusCircle, PercentIcon } from "lucide-react";

interface DebtBalanceCardProps {
  totalDebt: number;
  paidAmount: number;
  currencySymbol: string;
  progressPercentage: number;
}

export const DebtBalanceCard = ({
  totalDebt,
  paidAmount,
  currencySymbol,
  progressPercentage
}: DebtBalanceCardProps) => {
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <Card className="h-full bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#107A57]">TOTAL DEBT BALANCE</CardTitle>
          <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
            <CircleDollarSign className="w-6 h-6 text-[#34D399]" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Current total debt</p>
          <p className="text-2xl font-bold text-[#111827]">{formatCurrency(totalDebt)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#34D399]/10 rounded-lg">
                <ThumbsUp className="w-4 h-4 text-[#34D399]" />
              </div>
              <span className="text-gray-600">Total Paid Off</span>
            </div>
            <span className="text-[#111827]">{formatCurrency(paidAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#34D399]/10 rounded-lg">
                <MinusCircle className="w-4 h-4 text-[#34D399]" />
              </div>
              <span className="text-gray-600">Remaining Balance</span>
            </div>
            <span className="text-[#111827]">{formatCurrency(totalDebt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#34D399]/10 rounded-lg">
                <PercentIcon className="w-4 h-4 text-[#34D399]" />
              </div>
              <span className="text-gray-600">Progress</span>
            </div>
            <span className="text-[#111827]">{progressPercentage.toFixed(1)}% Complete</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-gray-100" />
      </CardContent>
    </Card>
  );
};