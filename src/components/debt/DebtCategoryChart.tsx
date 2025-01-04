import { Debt } from "@/lib/types/debt";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface DebtCategoryChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtCategoryChart = ({ debts, currencySymbol }: DebtCategoryChartProps) => {
  // Define darker, more vibrant colors for the category chart
  const DARK_COLORS = [
    '#6366F1', // Deep Indigo
    '#8B5CF6', // Deep Purple
    '#EC4899', // Deep Pink
    '#10B981', // Deep Emerald
    '#F59E0B', // Deep Amber
    '#EF4444', // Deep Red
    '#3B82F6', // Deep Blue
    '#6B7280'  // Deep Gray
  ];

  // Group debts by category and calculate total for each category
  const categoryData = Object.entries(
    debts.reduce((acc, debt) => {
      const category = debt.category || 'Other';
      acc[category] = (acc[category] || 0) + debt.balance;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, value]) => ({
    name: category,
    value
  }));

  const totalDebt = debts.reduce((sum, debt) => sum + Number(debt.balance), 0);
  const formatPercent = (value: number) => `${Math.round((value / totalDebt) * 100)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[270px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={108}
            innerRadius={54}
            paddingAngle={4}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={DARK_COLORS[index % DARK_COLORS.length]}
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
        {categoryData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: DARK_COLORS[index % DARK_COLORS.length] }}
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