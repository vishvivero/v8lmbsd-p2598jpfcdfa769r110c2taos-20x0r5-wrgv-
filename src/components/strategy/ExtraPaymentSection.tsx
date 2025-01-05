import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/strategies";

interface ExtraPaymentSectionProps {
  extraPayment: number;
  onExtraPaymentChange: (amount: number) => void;
  onOpenExtraPaymentDialog: () => void;
  currencySymbol?: string;
}

export const ExtraPaymentSection = ({
  extraPayment,
  onExtraPaymentChange,
  onOpenExtraPaymentDialog,
  currencySymbol = "£"
}: ExtraPaymentSectionProps) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <span className="text-sm text-gray-600">Extra Payment</span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={extraPayment}
          onChange={(e) => onExtraPaymentChange(Number(e.target.value))}
          className="w-32 text-right"
        />
        <Button
          variant="ghost"
          onClick={onOpenExtraPaymentDialog}
          className="text-primary hover:text-primary-dark"
        >
          {formatCurrency(extraPayment, currencySymbol)}
        </Button>
      </div>
    </div>
  );
};