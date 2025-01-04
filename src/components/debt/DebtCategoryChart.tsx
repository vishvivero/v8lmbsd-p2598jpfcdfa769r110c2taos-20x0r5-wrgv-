import { Debt } from "@/lib/types/debt";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface DebtCategoryChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtCategoryChart = ({ debts, currencySymbol }: DebtCategoryChartProps) => {
  // Group debts by category
  const categoryTotals = debts.reduce((acc, debt) => {
    const category = debt.category || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += debt.balance;
    return acc;
  }, {} as Record<string, number>);

  // Create data for the line chart
  const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total,
  }));

  // Define colors for different categories
  const CATEGORY_COLORS = {
    'Credit Card': '#FF6B6B',
    'Personal Loan': '#4FD1C5',
    'Student Loan': '#9F7AEA',
    'Mortgage': '#F6AD55',
    'Car Loan': '#38B2AC',
    'Other': '#ED8936',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [
              `${currencySymbol}${value.toLocaleString()}`,
              "Total Balance"
            ]}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{
              stroke: '#2563eb',
              strokeWidth: 2,
              r: 4,
              fill: '#fff'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};