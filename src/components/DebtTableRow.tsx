import { Debt } from "@/lib/types/debt";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface DebtTableRowProps {
  debt: Debt;
  payoffDetails: {
    months: number;
    totalInterest: number;
    payoffDate: Date;
    redistributionHistory?: {
      fromDebtId: string;
      amount: number;
      month: number;
    }[];
  };
  onUpdateClick: (debt: Debt) => void;
  onDeleteClick: (debt: Debt) => void;
  showDecimals?: boolean;
  currencySymbol?: string;
}

export const DebtTableRow = ({
  debt,
  payoffDetails,
  onUpdateClick,
  onDeleteClick,
  showDecimals = false,
  currencySymbol = '$'
}: DebtTableRowProps) => {
  // Format the time to payoff in years and months
  const formatPayoffTime = (months: number): string => {
    if (months === Infinity || months > 1200) return "Never";
    
    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  // Calculate progress
  const paidAmount = 0; // This would come from payment history in the future
  const progress = (paidAmount / debt.balance) * 100;

  const formatNumber = (num: number) => {
    return showDecimals 
      ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(num).toLocaleString();
  };

  console.log(`Rendering debt row for ${debt.name}:`, {
    payoffMonths: payoffDetails.months,
    formattedTime: formatPayoffTime(payoffDetails.months),
    totalInterest: payoffDetails.totalInterest,
    payoffDate: payoffDetails.payoffDate
  });

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-4">
        <div>
          <h3 className="font-medium text-gray-900">{debt.name}</h3>
          <p className="text-sm text-gray-500">{debt.banker_name}</p>
        </div>
      </td>
      <td className="py-4">
        <span className="font-medium">
          {currencySymbol}{formatNumber(debt.balance)}
        </span>
      </td>
      <td className="py-4">
        <span className="font-medium">{debt.interest_rate}%</span>
      </td>
      <td className="py-4">
        <span className="font-medium">
          {currencySymbol}{formatNumber(debt.minimum_payment)}
        </span>
      </td>
      <td className="py-4">
        <span className="font-medium">
          {formatPayoffTime(payoffDetails.months)}
        </span>
      </td>
      <td className="py-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Paid: {currencySymbol}{formatNumber(paidAmount)}</span>
            <span>Balance: {currencySymbol}{formatNumber(debt.balance)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-right text-sm text-gray-500">
            {progress.toFixed(1)}% Complete
          </div>
        </div>
      </td>
      <td className="py-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdateClick(debt)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(debt)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};