import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/strategies";
import { RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMonthlyPayment } from "@/hooks/use-monthly-payment";

interface ExtraPaymentSectionProps {
  onOpenExtraPaymentDialog: () => void;
  currencySymbol?: string;
}

export const ExtraPaymentSection = ({
  onOpenExtraPaymentDialog,
  currencySymbol = "£"
}: ExtraPaymentSectionProps) => {
  const { toast } = useToast();
  const { extraPayment, minimumPayment, updateMonthlyPayment, resetMonthlyPayment } = useMonthlyPayment();
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const extraValue = Number(e.target.value);
    const newTotalPayment = minimumPayment + extraValue;
    
    console.log('Handling input change:', {
      extraValue,
      minimumPayment,
      newTotalPayment
    });
    
    await updateMonthlyPayment(newTotalPayment);
  };

  const handleReset = async () => {
    await resetMonthlyPayment();
    
    // Reset input field
    const input = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
    
    toast({
      title: "Extra payment reset",
      description: "Extra payment has been reset to 0",
    });
    
    console.log('Extra payment reset completed');
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <span className="text-xl text-blue-600">+</span>
        </div>
        <span className="text-lg font-medium">Extra Payment</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <Input
            type="number"
            value={extraPayment || ''}
            onChange={handleInputChange}
            min={0}
            className="w-32 pl-3 pr-10 text-left"
          />
          {extraPayment > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-gray-100"
            >
              <RotateCw className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
        <span className="min-w-[100px] text-right text-lg font-medium text-emerald-500">
          {formatCurrency(extraPayment, currencySymbol)}
        </span>
      </div>
    </div>
  );
};