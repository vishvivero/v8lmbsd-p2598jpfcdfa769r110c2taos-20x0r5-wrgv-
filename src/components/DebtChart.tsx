import { Debt } from "@/lib/types/debt";
import { calculateMonthlyAllocation } from "@/lib/paymentCalculator";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { ChartGradients } from "./debt/chart/ChartGradients";
import { ChartTooltip } from "./debt/chart/ChartTooltip";
import { chartConfig, formatMonthYear, formatYAxis } from "./debt/chart/ChartConfig";

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol?: string;
}

export const DebtChart = ({ 
  debts, 
  monthlyPayment, 
  currencySymbol = '$' 
}: DebtChartProps) => {
  const generateChartData = () => {
    const data = [];
    let currentDebts = [...debts];
    let currentBalances = Object.fromEntries(
      debts.map(debt => [debt.id, debt.balance])
    );
    let month = 0;

    while (currentDebts.length > 0 && month < 1200) {
      const point: any = { 
        month,
        monthLabel: formatMonthYear(month)
      };

      if (currentDebts.length === 0) {
        point.total = 0;
        data.push(point);
        break;
      }

      const allocation = monthlyPayment > 0 
        ? calculateMonthlyAllocation(currentDebts, monthlyPayment)
        : Object.fromEntries(currentDebts.map(d => [d.id, 0]));

      currentDebts = currentDebts.filter(debt => {
        const payment = allocation[debt.id] || 0;
        const monthlyInterest = (debt.interest_rate / 1200) * currentBalances[debt.id];
        currentBalances[debt.id] = Math.max(0, 
          currentBalances[debt.id] + monthlyInterest - payment
        );

        point[debt.name] = currentBalances[debt.id];
        
        return currentBalances[debt.id] > 0.01;
      });

      point.total = Object.values(currentBalances).reduce((a, b) => a + b, 0);
      
      if (month === 0 || currentDebts.length === 0 || 
          month % Math.max(1, Math.floor(data.length / 10)) === 0) {
        data.push(point);
      }

      month++;
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-4 rounded-xl bg-white/90 shadow-lg border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          stackOffset="silhouette"
        >
          <ChartGradients debts={debts} />
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e0e0e0" 
            vertical={false}
          />
          <XAxis
            dataKey="monthLabel"
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: '#666', fontSize: 12 }}
            stroke="#e0e0e0"
          />
          <YAxis
            tickFormatter={(value) => formatYAxis(value, currencySymbol)}
            tick={{ fill: '#666', fontSize: 12 }}
            stroke="#e0e0e0"
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip 
                active={active} 
                payload={payload} 
                label={label}
                currencySymbol={currencySymbol}
              />
            )}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
          />
          {debts.map((debt, index) => (
            <Area
              key={debt.id}
              type={chartConfig.curve}
              dataKey={debt.name}
              stroke={`hsl(${(index * 360) / debts.length}, 85%, 65%)`}
              strokeWidth={2}
              stackId="1"
              fill={`url(#gradient-${index})`}
              fillOpacity={chartConfig.opacity.area}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};