import React from 'react';
import { TooltipProps } from 'recharts';
import { formatTooltipValue } from './ChartConfig';

interface CustomTooltipProps extends TooltipProps<any, any> {
  currencySymbol: string;
}

export const ChartTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  currencySymbol 
}) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white/95 p-3 rounded-lg shadow-lg border border-gray-100">
      <p className="font-medium text-sm text-gray-600 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span style={{ color: entry.color }}>{entry.name}:</span>
          <span className="font-medium">
            {formatTooltipValue(entry.value, currencySymbol)}
          </span>
        </div>
      ))}
    </div>
  );
};