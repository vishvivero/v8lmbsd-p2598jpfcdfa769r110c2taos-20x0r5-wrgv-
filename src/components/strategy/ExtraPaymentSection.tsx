import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/strategies";
import { RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const clampedValue = Math.min(Math.max(0, value), 1000);
    onExtraPaymentChange(clampedValue);
    
    console.log('Extra payment updated:', {
      inputValue: value,
      clampedValue,
      currencySymbol
    });
  };

  const handleReset = () => {
    onExtraPaymentChange(0);
    toast({
      title: "Extra payment reset",
      description: "Extra payment has been reset to 0",
    });
    
    console.log('Extra payment reset to 0');
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Extra Payment</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="text-muted-foreground hover:text-primary"
          title="Reset extra payment"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={extraPayment}
          onChange={handleInputChange}
          min={0}
          max={1000}
          className="w-32"
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