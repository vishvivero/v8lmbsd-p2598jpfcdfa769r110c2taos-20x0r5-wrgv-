import { Debt } from "@/lib/types/debt";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

interface DebtChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtChart = ({ debts, currencySymbol }: DebtChartProps) => {
  // Define gradient colors for each segment
  const GRADIENT_COLORS = [
    ['#FF6B6B', '#FFA07A'], // Coral gradient
    ['#9F7AEA', '#D53F8C'], // Purple to Pink gradient
    ['#38B2AC', '#4FD1C5'], // Teal gradient
    ['#F6AD55', '#ED8936']  // Orange gradient
  ];

  const pieChartData = debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    gradientStart: GRADIENT_COLORS[index % GRADIENT_COLORS.length][0],
    gradientEnd: GRADIENT_COLORS[index % GRADIENT_COLORS.length][1]
  }));

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.balance), 0);
  const formatPercent = (value: number) => `${((value / totalDebt) * 100).toFixed(1)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[270px]" // Reduced from 300px to 270px (10% reduction)
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {pieChartData.map((entry, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={entry.gradientStart}
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor={entry.gradientEnd}
                  stopOpacity={0.9}
                />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={108} // Reduced from 120 to 108 (10% reduction)
            innerRadius={54}  // Reduced from 60 to 54 (10% reduction)
            paddingAngle={4}
            label={({ name, value }) => `${name} (${formatPercent(value)})`}
            labelLine={{ stroke: '#666666', strokeWidth: 1 }}
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient-${index})`}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {pieChartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                background: `linear-gradient(135deg, ${entry.gradientStart}, ${entry.gradientEnd})`
              }}
            />
            <span className="text-sm text-gray-600">
              {entry.name} ({formatPercent(entry.value)})
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};