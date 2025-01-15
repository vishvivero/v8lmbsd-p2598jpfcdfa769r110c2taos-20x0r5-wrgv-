import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/strategies";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

interface SimulatorSectionProps {
  simulatedExtra: number;
  setSimulatedExtra: (value: number) => void;
  extraPayment: number;
  currencySymbol: string;
  onExtraPaymentChange: (amount: number) => void;
  maxValue: number;
}

export const SimulatorSection = ({
  simulatedExtra,
  setSimulatedExtra,
  extraPayment,
  currencySymbol,
  onExtraPaymentChange,
  maxValue
}: SimulatorSectionProps) => {
  const handleSliderChange = (value: number[]) => {
    setSimulatedExtra(value[0]);
    onExtraPaymentChange(value[0]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="space-y-4 bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">
            Simulate extra payment
          </span>
        </div>
        <span className="font-semibold text-lg text-primary">
          {formatCurrency(simulatedExtra, currencySymbol)}
        </span>
      </div>
      
      <div className="pt-4">
        <Slider
          value={[simulatedExtra]}
          onValueChange={handleSliderChange}
          max={maxValue}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>{formatCurrency(0, currencySymbol)}</span>
          <span>{formatCurrency(maxValue, currencySymbol)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Adjust to see how different payment amounts affect your debt payoff
      </p>
    </motion.div>
  );
};