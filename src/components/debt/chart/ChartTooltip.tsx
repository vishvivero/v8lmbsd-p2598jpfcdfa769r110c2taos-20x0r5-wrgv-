import { formatCurrency } from "./chartUtils";
import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { format } from "date-fns";

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  currencySymbol: string;
}

export const ChartTooltip = ({ 
  active, 
  payload, 
  label, 
  currencySymbol 
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const oneTimeFunding = payload.find((p) => p.dataKey === 'oneTimeFunding');
    
    // Helper function to safely convert ValueType to number
    const getNumericValue = (value: ValueType): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseFloat(value);
      return 0;
    };
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-2">{format(date, 'MMMM yyyy')}</p>
        {oneTimeFunding && getNumericValue(oneTimeFunding.value) > 0 && (
          <p className="text-emerald-600 font-medium mb-2">
            One-time funding: {formatCurrency(getNumericValue(oneTimeFunding.value), currencySymbol)}
          </p>
        )}
        {payload.map((entry, index) => {
          const value = getNumericValue(entry.value);
          if (entry.dataKey !== 'oneTimeFunding' && value > 0) {
            return (
              <p key={index} style={{ color: entry.color }} className="flex justify-between">
                <span>{entry.name}:</span>
                <span className="ml-4 font-medium">
                  {formatCurrency(value, currencySymbol)}
                </span>
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};