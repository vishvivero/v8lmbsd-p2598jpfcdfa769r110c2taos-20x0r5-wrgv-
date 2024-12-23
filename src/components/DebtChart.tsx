import { Debt, calculatePayoffTime, formatCurrency } from "@/lib/strategies";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
}

export const DebtChart = ({ debts, monthlyPayment }: DebtChartProps) => {
  const generateChartData = () => {
    const months = 24; // Show 2 years projection
    const data = [];

    for (let i = 0; i <= months; i++) {
      const point: any = { month: i };
      let totalBalance = 0;

      debts.forEach((debt) => {
        const remainingMonths = calculatePayoffTime(debt, monthlyPayment);
        const balance = i >= remainingMonths ? 0 : debt.balance * Math.pow(1 - debt.interestRate / 1200, i);
        totalBalance += balance;
        point[debt.name] = balance;
      });

      point.total = totalBalance;
      data.push(point);
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="chart-container"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: "Months", position: "bottom" }} />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            label={{ value: "Balance", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Month ${label}`}
          />
          {debts.map((debt, index) => (
            <Line
              key={debt.id}
              type="monotone"
              dataKey={debt.name}
              stroke={`hsl(${(index * 360) / debts.length}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#000"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};