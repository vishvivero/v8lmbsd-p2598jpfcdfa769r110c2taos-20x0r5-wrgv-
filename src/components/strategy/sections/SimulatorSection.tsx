import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/strategies";

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
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Simulate extra payment
        </span>
        <span className="font-semibold text-[#00D382]">
          {formatCurrency(simulatedExtra, currencySymbol)}
        </span>
      </div>
      <Slider
        value={[simulatedExtra]}
        onValueChange={([value]) => handleSliderChange([value])}
        max={maxValue}
        step={10}
        className="w-full"
      />
      <p className="text-sm text-gray-500">
        Adjust to see how different payment amounts affect your debt payoff
      </p>
    </div>
  );
};