import { formatCurrency } from "@/lib/strategies";

interface OverviewSectionProps {
  totalSavings: number;
  interestSaved: number;
  monthsSaved: number;
  currencySymbol: string;
}

export const OverviewSection = ({
  totalSavings,
  interestSaved,
  monthsSaved,
  currencySymbol
}: OverviewSectionProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <p className="text-sm text-gray-600">Total Extra Payments</p>
        <p className="text-xl font-semibold mt-1">
          {formatCurrency(totalSavings, currencySymbol)}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Interest Saved</p>
        <p className="text-xl font-semibold mt-1 text-[#F97316]">
          {formatCurrency(interestSaved, currencySymbol)}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Time Saved</p>
        <p className="text-xl font-semibold mt-1">
          {monthsSaved} months
        </p>
      </div>
    </div>
  );
};