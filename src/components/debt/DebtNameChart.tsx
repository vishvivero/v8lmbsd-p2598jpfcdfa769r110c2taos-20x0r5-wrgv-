import { Debt } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "../debt/chart/chartUtils";
import { chartConfig } from "../debt/chart/chartStyles";

interface DebtNameChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtNameChart = ({ debts, currencySymbol }: DebtNameChartProps) => {
  const debtData = debts.map(debt => ({
    name: debt.name,
    value: debt.balance
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-4 rounded-xl bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm shadow-lg border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={debtData}
          margin={chartConfig.margin}
        >
          <CartesianGrid
            strokeDasharray={chartConfig.gridStyle.strokeDasharray}
            stroke={chartConfig.gridStyle.stroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currencySymbol)}
            contentStyle={chartConfig.tooltipStyle}
          />
          <Bar
            dataKey="value"
            fill="#34D399"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};