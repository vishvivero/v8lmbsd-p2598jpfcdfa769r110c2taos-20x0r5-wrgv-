import { Debt } from "@/lib/strategies";
import { calculateMonthlyAllocation } from "@/lib/paymentCalculator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { motion } from "framer-motion";

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol?: string;
}

export const DebtChart = ({ debts, monthlyPayment, currencySymbol = '$' }: DebtChartProps) => {
  const generateChartData = () => {
    const data = [];
    let currentDebts = [...debts];
    let currentBalances = Object.fromEntries(
      debts.map(debt => [debt.id, debt.balance])
    );
    let allPaidOff = false;
    let month = 0;

    while (!allPaidOff && month < 1200) {
      const point: any = { 
        month,
        monthLabel: formatMonthYear(month)
      };
      let totalBalance = 0;

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
        totalBalance += currentBalances[debt.id];

        return currentBalances[debt.id] > 0.01;
      });

      point.total = totalBalance;
      
      if (month === 0 || currentDebts.length === 0 || 
          month % Math.max(1, Math.floor(data.length / 10)) === 0) {
        data.push(point);
      }

      allPaidOff = currentDebts.length === 0;
      month++;
    }

    return data;
  };

  const formatMonthYear = (monthsFromNow: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
    }
    return `${currencySymbol}${value.toFixed(0)}`;
  };

  const formatTooltipValue = (value: number) => {
    return `${currencySymbol}${value.toLocaleString()}`;
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-4 rounded-xl bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm shadow-lg border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {debts.map((_, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`hsl(${(index * 360) / debts.length}, 70%, 50%)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`hsl(${(index * 360) / debts.length}, 70%, 50%)`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#000000" stopOpacity={0.05} />
            </linearGradient>
          </defs>
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
            tickFormatter={formatYAxis}
            label={{
              value: "Balance",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fill: '#666', fontSize: 12 }
            }}
            tick={{ fill: '#666', fontSize: 12 }}
            stroke="#e0e0e0"
            allowDecimals={false}
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              padding: '8px 12px'
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '20px'
            }}
          />
          {debts.map((debt, index) => (
            <Area
              key={debt.id}
              type="monotone"
              dataKey={debt.name}
              stroke={`hsl(${(index * 360) / debts.length}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
              fill={`url(#gradient-${index})`}
              fillOpacity={0.6}
              stackId="1"
            />
          ))}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#000000"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};