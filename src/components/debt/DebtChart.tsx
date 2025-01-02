import { Debt } from "@/lib/types/debt";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DebtChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtChart = ({ debts, currencySymbol }: DebtChartProps) => {
  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#FF0000'];

  const pieChartData = debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${currencySymbol}${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {pieChartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};