import { formatCurrency } from "./chartUtils";
import { ChartTooltipProps } from "./types";

export const ChartTooltip = ({ 
  x,
  y,
  date,
  values = [],
  currencySymbol 
}: ChartTooltipProps) => {
  if (!date || !values.length) return null;

  const tooltipStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -100%)',
    pointerEvents: 'none',
    zIndex: 10
  } as const;

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
      style={tooltipStyle}
    >
      <p className="font-semibold mb-2">
        {new Date(date).toLocaleDateString()}
      </p>
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