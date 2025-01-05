import { formatCurrency } from "@/lib/strategies";

interface MinimumPaymentSectionProps {
  totalMinimumPayments: number;
  currencySymbol?: string;
}

export const MinimumPaymentSection = ({
  totalMinimumPayments,
  currencySymbol = "£"
}: MinimumPaymentSectionProps) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <span className="text-sm text-gray-600">Minimum</span>
      <span className="font-medium">
        {formatCurrency(totalMinimumPayments, currencySymbol)}
      </span>
    </div>
  );
};