import { Debt, calculatePayoffTime, formatCurrency } from "@/lib/strategies";
import { calculateMonthlyAllocation } from "@/lib/paymentCalculator";
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
  currencySymbol?: string;
}

export const DebtChart = ({ debts, monthlyPayment, currencySymbol = '$' }: DebtChartProps) => {
  const generateChartData = () => {
    const months = 24; // Show 2 years projection
    const data = [];
    let currentDebts = [...debts];
    let currentBalances = Object.fromEntries(
      debts.map(debt => [debt.id, debt.balance])
    );

    for (let i = 0; i <= months; i++) {
      const point: any = { month: i };
      let totalBalance = 0;

      // Skip calculation if no debts remain
      if (currentDebts.length === 0) {
        point.total = 0;
        data.push(point);
        continue;
      }

      // Calculate payment allocation for this month
      // When monthlyPayment is 0, we'll just accumulate interest
      const allocation = monthlyPayment > 0 
        ? calculateMonthlyAllocation(currentDebts, monthlyPayment)
        : Object.fromEntries(currentDebts.map(d => [d.id, 0]));

      // Update balances based on payments and interest
      currentDebts = currentDebts.filter(debt => {
        const payment = allocation[debt.id] || 0;
        const monthlyInterest = (debt.interestRate / 1200) * currentBalances[debt.id];
        currentBalances[debt.id] = Math.max(0, 
          currentBalances[debt.id] + monthlyInterest - payment
        );

        // Add to chart point
        point[debt.name] = currentBalances[debt.id];
        totalBalance += currentBalances[debt.id];

        // Keep debt if balance remains
        return currentBalances[debt.id] > 0;
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
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            label={{ value: "Balance", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currencySymbol)}
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
