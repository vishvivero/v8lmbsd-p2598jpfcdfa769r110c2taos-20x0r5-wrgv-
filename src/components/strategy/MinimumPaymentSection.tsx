import { formatCurrency } from "@/lib/strategies";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

interface MinimumPaymentSectionProps {
  totalMinimumPayments: number;
  currencySymbol?: string;
}

export const MinimumPaymentSection = ({
  totalMinimumPayments,
  currencySymbol = "£"
}: MinimumPaymentSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center flex-wrap gap-2 p-4 bg-card rounded-lg border shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium">Minimum Required</span>
      </div>
      <span className="font-semibold text-lg">
        {formatCurrency(totalMinimumPayments, currencySymbol)}
      </span>
    </motion.div>
  );
};