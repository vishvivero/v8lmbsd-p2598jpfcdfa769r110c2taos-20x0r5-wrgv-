import { formatCurrency } from "./chartUtils";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currencySymbol: string;
  extraPayment: number;
  totalMinPayments: number;
}

export const ChartTooltip = ({ 
  active, 
  payload, 
  label,
  currencySymbol,
  extraPayment,
  totalMinPayments
}: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const oneTimeFunding = payload.find((p: any) => p.dataKey === 'oneTimeFunding');
  const extraMonthlyPayment = Math.max(0, extraPayment - totalMinPayments);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold mb-2">{label}</p>
      {oneTimeFunding && oneTimeFunding.value > 0 && (
        <p className="text-emerald-600 font-medium mb-2">
          One-time funding: {formatCurrency(oneTimeFunding.value, currencySymbol)}
        </p>
      )}
      {extraMonthlyPayment > 0 && (
        <p className="text-blue-600 font-medium mb-2">
          Extra monthly payment: {formatCurrency(extraMonthlyPayment, currencySymbol)}
        </p>
      )}
      {payload.map((entry: any, index: number) => {
        if (entry.dataKey !== 'oneTimeFunding') {
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
};