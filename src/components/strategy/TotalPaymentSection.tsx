import { formatCurrency } from "@/lib/strategies";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface TotalPaymentSectionProps {
  totalPayment: number;
  currencySymbol?: string;
}

export const TotalPaymentSection = ({
  totalPayment,
  currencySymbol = "£"
}: TotalPaymentSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center flex-wrap gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/20">
          <ArrowUp className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">Total Monthly Payment</span>
      </div>
      <span className="font-semibold text-lg text-primary">
        {formatCurrency(totalPayment, currencySymbol)}
      </span>
    </motion.div>
  );
};