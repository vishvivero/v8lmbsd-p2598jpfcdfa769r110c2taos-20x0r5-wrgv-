import { formatCurrency } from "./chartUtils";

export const ChartTooltip = ({ 
  x,
  y,
  date,
  values = [],
  currencySymbol 
}: ChartTooltipProps) => {
  if (!date || !values.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold mb-2">{date}</p>
      {values.map((entry, index) => {
        if (entry.value > 0) {
          return (
            <p key={index} className="flex justify-between">
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
};