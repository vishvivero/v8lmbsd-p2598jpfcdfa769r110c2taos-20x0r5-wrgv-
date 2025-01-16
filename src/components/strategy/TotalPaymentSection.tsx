import { formatCurrency } from "@/lib/strategies";

interface TotalPaymentSectionProps {
  totalPayment: number;
  currencySymbol?: string;
}

export const TotalPaymentSection = ({
  totalPayment,
  currencySymbol = "£"
}: TotalPaymentSectionProps) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-emerald-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-xl text-emerald-600">↑</span>
        </div>
        <span className="text-lg font-medium">Total Monthly Payment</span>
      </div>
      <span className="min-w-[100px] text-right text-lg font-medium text-emerald-500">
        {formatCurrency(totalPayment, currencySymbol)}
      </span>
    </div>
  );
};