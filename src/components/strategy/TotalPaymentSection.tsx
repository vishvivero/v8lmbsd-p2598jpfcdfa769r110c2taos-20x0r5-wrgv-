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
    <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t">
      <span className="font-medium">Total Monthly Payment</span>
      <span className="font-medium text-primary text-right min-w-[100px]">
        {formatCurrency(totalPayment, currencySymbol)}
      </span>
    </div>
  );
};