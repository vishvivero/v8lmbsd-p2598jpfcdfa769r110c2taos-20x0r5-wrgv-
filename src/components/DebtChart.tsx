import { Debt } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  ReferenceLine,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency, formatMonthYear } from "./debt/chart/chartUtils";
import { getGradientDefinitions, chartConfig, PASTEL_COLORS } from "./debt/chart/chartStyles";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { ChartTooltip } from "./debt/chart/ChartTooltip";
import { calculateChartDomain } from "./debt/chart/chartCalculations";
import { strategies } from "@/lib/strategies";
import { useProfile } from "@/hooks/use-profile";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol?: string;
  oneTimeFundings?: OneTimeFunding[];
}

export const DebtChart = ({ 
  debts, 
  monthlyPayment, 
  currencySymbol = '$',
  oneTimeFundings = []
}: DebtChartProps) => {
  const { profile } = useProfile();
  
  const selectedStrategy = strategies.find(s => s.id === profile?.selected_strategy) || strategies[0];

  // Use the same calculation logic as Debt Summary
  const payoffDetails = calculatePayoffDetails(
    debts,
    monthlyPayment,
    selectedStrategy,
    oneTimeFundings
  );

  const chartData = generateChartData(debts, payoffDetails, oneTimeFundings);
  const gradients = getGradientDefinitions(debts);

  const fundingMonths = oneTimeFundings.map(funding => {
    const date = new Date(funding.payment_date);
    const now = new Date();
    const monthsDiff = (date.getFullYear() - now.getFullYear()) * 12 + 
                      (date.getMonth() - now.getMonth());
    return {
      month: monthsDiff,
      amount: funding.amount,
      date
    };
  });

  const { maxDebt } = calculateChartDomain(chartData);

  console.log('Rendering DebtChart with:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    totalPayoffMonths: Math.max(...Object.values(payoffDetails).map(d => d.months)),
    oneTimeFundings: oneTimeFundings.length,
    chartData
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-6 rounded-2xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            {gradients.map(({ id, startColor, endColor, opacity }) => (
              <linearGradient
                key={id}
                id={id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={startColor}
                  stopOpacity={opacity.start}
                />
                <stop
                  offset="95%"
                  stopColor={endColor}
                  stopOpacity={opacity.end}
                />
              </linearGradient>
            ))}
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
          <XAxis
            dataKey="monthLabel"
            interval={2}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis
            domain={[0, maxDebt * 1.1]}
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            label={{
              value: "Balance",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fill: '#6B7280', fontSize: 12 }
            }}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
            allowDecimals={false}
          />
          <Tooltip content={(props) => <ChartTooltip {...props} currencySymbol={currencySymbol} />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
          />

          <Area
            type="monotone"
            dataKey="Total"
            fill="url(#totalGradient)"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />

          {fundingMonths.map((funding, index) => (
            <ReferenceLine
              key={index}
              x={formatMonthYear(funding.month)}
              stroke="#10B981"
              strokeDasharray="3 3"
              label={{
                value: `+${currencySymbol}${funding.amount}`,
                position: 'top',
                fill: '#10B981',
                fontSize: 12
              }}
            />
          ))}

          {debts.map((debt, index) => (
            <Line
              key={debt.id}
              type="monotone"
              dataKey={debt.name}
              stroke={PASTEL_COLORS[index % PASTEL_COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

const generateChartData = (
  debts: Debt[],
  payoffDetails: { [key: string]: any },
  oneTimeFundings: OneTimeFunding[] = []
) => {
  const maxMonths = Math.max(...Object.values(payoffDetails).map(d => d.months));
  console.log('Generating chart data with:', {
    numberOfDebts: debts.length,
    payoffMonths: maxMonths,
    oneTimeFundings: oneTimeFundings.length
  });

  const data = [];

  for (let month = 0; month <= maxMonths; month++) {
    const point: any = {
      month,
      monthLabel: formatMonthYear(month),
      Total: 0
    };

    let totalBalance = 0;
    
    debts.forEach(debt => {
      const detail = payoffDetails[debt.id];
      const monthlyRate = debt.interest_rate / 1200;
      let balance = debt.balance;

      if (month <= detail.months) {
        const monthlyPayment = detail.monthlyPayment;
        for (let m = 0; m < month; m++) {
          const interest = balance * monthlyRate;
          balance = Math.max(0, balance + interest - monthlyPayment);
        }
      } else {
        balance = 0;
      }

      point[debt.name] = balance;
      totalBalance += balance;
    });

    point.Total = totalBalance;
    
    const extraPayment = oneTimeFundings.find(f => {
      const fundingDate = new Date(f.payment_date);
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + month);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });
    
    if (extraPayment) {
      point.oneTimeFunding = extraPayment.amount;
    }
    
    data.push(point);
    
    if (totalBalance <= 0) break;
  }

  return data;
};