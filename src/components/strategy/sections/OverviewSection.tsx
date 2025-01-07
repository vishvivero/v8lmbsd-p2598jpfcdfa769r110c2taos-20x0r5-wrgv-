import { formatCurrency } from "@/lib/strategies";
import { format } from "date-fns";
import { Clock, Calendar, DollarSign, TrendingDown, Hourglass } from "lucide-react";

interface OverviewSectionProps {
  totalSavings: number;
  interestSaved: number;
  monthsSaved: number;
  currencySymbol: string;
  debtFreeDate?: Date;
}

export const OverviewSection = ({
  totalSavings,
  interestSaved,
  monthsSaved,
  currencySymbol,
  debtFreeDate
}: OverviewSectionProps) => {
  const timeUntilDebtFree = debtFreeDate ? Math.ceil((debtFreeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Total Extra Payments</span>
          </div>
          <p className="text-xl font-semibold">
            {formatCurrency(totalSavings, currencySymbol)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Interest Saved</span>
          </div>
          <p className="text-xl font-semibold text-orange-600">
            {formatCurrency(interestSaved, currencySymbol)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time Saved</span>
          </div>
          <p className="text-lg font-semibold">
            {monthsSaved} months
          </p>
        </div>
        
        {debtFreeDate && (
          <>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Debt-free Date</span>
              </div>
              <p className="text-lg font-semibold">
                {format(debtFreeDate, 'MMM yyyy')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-600 mb-2">
                <Hourglass className="h-4 w-4" />
                <span className="text-sm font-medium">Time Until</span>
              </div>
              <p className="text-lg font-semibold">
                {timeUntilDebtFree} months
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};