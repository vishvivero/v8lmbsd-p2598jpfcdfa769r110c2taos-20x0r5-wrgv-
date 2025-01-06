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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Ensure the value doesn't exceed the max limit (1000) from the dialog
    const clampedValue = Math.min(Math.max(0, value), 1000);
    onExtraPaymentChange(clampedValue);
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <span className="text-sm text-gray-600">Extra Payment</span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={extraPayment}
          onChange={handleInputChange}
          min={0}
          max={1000}
          className="w-32 text-right"
        />
        <Button
          variant="ghost"
          onClick={onOpenExtraPaymentDialog}
          className="text-[#00D382] hover:text-[#00D382]/90"
        >
          {formatCurrency(extraPayment, currencySymbol)}
        </Button>
      </div>
    </div>
  );
};