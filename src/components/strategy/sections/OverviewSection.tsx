import { formatCurrency } from "@/lib/strategies";

interface OverviewSectionProps {
  totalSavings: number;
  interestSaved: number;
  monthsSaved: number;
  currencySymbol: string;
}

export const OverviewSection = ({ 
  totalSavings = 0, 
  interestSaved = 0, 
  monthsSaved = 0,
  currencySymbol 
}: OverviewSectionProps) => {
  console.log('OverviewSection render:', {
    totalSavings,
    interestSaved,
    monthsSaved,
    currencySymbol
  });

  // Ensure we're working with numbers and default to 0 if invalid
  const sanitizedTotalSavings = Number(totalSavings) || 0;
  const sanitizedInterestSaved = Number(interestSaved) || 0;
  const sanitizedMonthsSaved = Number(monthsSaved) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Total Extra Payments</span>
        <span className="font-semibold text-primary">
          {formatCurrency(sanitizedTotalSavings, currencySymbol)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Interest Saved</span>
        <span className="font-semibold text-green-600">
          {formatCurrency(sanitizedInterestSaved, currencySymbol)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Time Saved</span>
        <span className="font-semibold text-blue-600">
          {sanitizedMonthsSaved > 0 ? `${sanitizedMonthsSaved} months` : '0 months'}
        </span>
      </div>
    </div>
  );
};