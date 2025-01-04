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

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.balance), 0);
  const formatPercent = (value: number) => `${((value / totalDebt) * 100).toFixed(1)}%`;
  
  const pieChartData = debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    percentage: formatPercent(debt.balance),
    gradientStart: GRADIENT_COLORS[index % GRADIENT_COLORS.length][0],
    gradientEnd: GRADIENT_COLORS[index % GRADIENT_COLORS.length][1]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-gray-600">
            {currencySymbol}{data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{data.percentage}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                background: `linear-gradient(135deg, ${entry.payload.gradientStart}, ${entry.payload.gradientEnd})`
              }}
            />
            <span className="text-sm text-gray-700 font-medium">
              {entry.payload.name}
            </span>
            <span className="text-sm text-gray-500">
              ({entry.payload.percentage})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full min-h-[400px] flex flex-col"
    >
      <div className="flex-1">
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
              outerRadius={120}
              innerRadius={60}
              paddingAngle={4}
              label={({ name, percentage }) => `${name} (${percentage})`}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};