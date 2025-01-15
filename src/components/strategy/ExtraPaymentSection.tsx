import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/strategies";
import { RotateCw, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMonthlyPayment } from "@/hooks/use-monthly-payment";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-card rounded-lg border shadow-sm"
    >
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-secondary/10">
            <Plus className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-sm font-medium">Extra Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="number"
              value={extraPayment || ''}
              onChange={handleInputChange}
              min={0}
              className="w-32 text-left pr-8"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-primary"
              title="Reset extra payment"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={onOpenExtraPaymentDialog}
            className="text-primary hover:text-primary/90 min-w-[100px] text-center"
          >
            {formatCurrency(extraPayment, currencySymbol)}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};