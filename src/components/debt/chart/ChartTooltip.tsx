import { formatCurrency } from "./chartUtils";
import { ChartTooltipProps } from "./types";
import { format } from "date-fns";

export const ChartTooltip = ({ 
  active, 
  payload, 
  label,
  currencySymbol,
  x,
  y,
  date,
  values
}: ChartTooltipProps) => {
  // If we have direct values from hover, use those
  if (values && date) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-2">{format(new Date(date), 'MMMM yyyy')}</p>
        {values.map((entry, index) => (
          <p key={index} className="flex justify-between">
            <span>{entry.name}:</span>
            <span className="ml-4 font-medium">
              {formatCurrency(entry.value, currencySymbol)}
            </span>
          </p>
        ))}
      </div>
    );
  }

  // Otherwise use the Recharts payload
  if (active && payload && payload.length) {
    const date = new Date(label);
    const oneTimeFunding = payload.find((p) => p.dataKey === 'oneTimeFunding');
    
    // Helper function to safely convert ValueType to number
    const getNumericValue = (value: any): number => {
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
