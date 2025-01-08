import { formatCurrency } from "./chartUtils";
import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
    const oneTimeFunding = payload.find((p) => p.dataKey === 'oneTimeFunding');
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-2">{label}</p>
        {oneTimeFunding && oneTimeFunding.value > 0 && (
          <p className="text-emerald-600 font-medium mb-2">
            One-time funding: {formatCurrency(oneTimeFunding.value, currencySymbol)}
          </p>
        )}
        {payload.map((entry, index) => {
          if (entry.dataKey !== 'oneTimeFunding' && entry.value > 0) {
            return (
              <p key={index} style={{ color: entry.color }} className="flex justify-between">
                <span>{entry.name}:</span>
                <span className="ml-4 font-medium">
                  {formatCurrency(entry.value, currencySymbol)}
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