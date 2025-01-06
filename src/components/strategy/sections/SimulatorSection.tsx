import { TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/strategies";

interface SimulatorSectionProps {
  simulatedExtra: number;
  extraPayment: number;
  currencySymbol: string;
  onSimulatedExtraChange: (value: number[]) => void;
}

export const SimulatorSection = ({
  simulatedExtra,
  extraPayment,
  currencySymbol,
  onSimulatedExtraChange,
}: SimulatorSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Savings Simulator
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Extra Payment Amount</span>
          <span>{formatCurrency(simulatedExtra, currencySymbol)}</span>
        </div>
        <Slider
          value={[simulatedExtra]}
          onValueChange={onSimulatedExtraChange}
          max={1000}
          step={10}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-2">
          {simulatedExtra > extraPayment
            ? `Increasing your payment by ${formatCurrency(
                simulatedExtra - extraPayment,
                currencySymbol
              )} could save you ${formatCurrency(
                (simulatedExtra - extraPayment) * 0.2,
                currencySymbol
              )} in interest!`
            : "Try increasing your extra payment to see potential savings"}
        </p>
      </div>
    </div>
  );
};