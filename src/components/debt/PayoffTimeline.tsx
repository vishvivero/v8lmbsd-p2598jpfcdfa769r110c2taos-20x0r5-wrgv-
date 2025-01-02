import { Debt } from "@/lib/types/debt";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculatePayoffTimeline } from "@/lib/utils/paymentCalculations";

interface PayoffTimelineProps {
  debt: Debt;
  extraPayment: number;
}

export const PayoffTimeline = ({ debt, extraPayment }: PayoffTimelineProps) => {
  const data = calculatePayoffTimeline(debt, extraPayment);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `${debt.currency_symbol}${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${debt.currency_symbol}${Number(value).toLocaleString()}`, "Balance"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={false}
          />
          {extraPayment > 0 && (
            <Line 
              type="monotone" 
              dataKey="balanceWithExtra" 
              stroke="#16a34a" 
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};