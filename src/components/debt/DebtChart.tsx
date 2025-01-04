import { Debt } from "@/lib/types/debt";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

interface DebtChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtChart = ({ debts, currencySymbol }: DebtChartProps) => {
  // Define a professional gradient color palette
  const GRADIENT_COLORS = [
    ['#9b87f5', '#7E69AB'], // Primary Purple to Secondary Purple
    ['#0EA5E9', '#1EAEDB'], // Ocean Blue to Bright Blue
    ['#8B5CF6', '#6366F1'], // Violet to Indigo
    ['#3B82F6', '#60A5FA']  // Blue shades
  ];

  const pieChartData = debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    gradientStart: GRADIENT_COLORS[index % GRADIENT_COLORS.length][0],
    gradientEnd: GRADIENT_COLORS[index % GRADIENT_COLORS.length][1]
  }));

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.balance), 0);
  const formatPercent = (value: number) => `${((value / totalDebt) * 100).toFixed(1)}%`;
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-gray-600">
            {currencySymbol}{Number(payload[0].value).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {formatPercent(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full shadow-sm" 
              style={{ 
                background: `linear-gradient(135deg, ${pieChartData[index].gradientStart}, ${pieChartData[index].gradientEnd})`
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {entry.value}
              </span>
              <span className="text-xs text-gray-500">
                {formatPercent(pieChartData[index].value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full min-h-[400px] flex flex-col"
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
              outerRadius="90%"
              innerRadius="60%"
              paddingAngle={4}
              label={({ name, value }) => `${formatPercent(value)}`}
              labelLine={{ stroke: '#8E9196', strokeWidth: 1 }}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                  className="drop-shadow-lg"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};