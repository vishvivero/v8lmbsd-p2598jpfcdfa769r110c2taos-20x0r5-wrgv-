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
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-xl text-emerald-600">$</span>
        </div>
        <span className="text-lg font-medium">Minimum Required</span>
      </div>
      <span className="min-w-[100px] text-right text-lg font-medium">
        {formatCurrency(totalMinimumPayments, currencySymbol)}
      </span>
    </div>
  );
};