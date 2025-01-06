import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { Debt } from "@/lib/types/debt";

interface DebtOverviewChartProps {
  debts: Debt[];
}

export const DebtOverviewChart = ({ debts }: DebtOverviewChartProps) => {
  const debtData = debts?.map(debt => ({
    name: debt.name,
    balance: Number(debt.balance),
    interestRate: Number(debt.interest_rate),
  })) || [];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={debtData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            className="text-xs"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            className="text-xs"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            className="text-xs"
          />
          <Tooltip />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="balance" 
            fill="#34D399" 
            name="Balance" 
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="interestRate"
            stroke="#818CF8"
            name="Interest Rate %"
            strokeWidth={2}
            dot={{ fill: '#818CF8', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};