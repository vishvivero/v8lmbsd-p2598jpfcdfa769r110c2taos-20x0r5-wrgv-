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
      className="w-full h-[400px] p-4 rounded-xl bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm shadow-lg border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={chartConfig.margin}
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
          </defs>
          <CartesianGrid 
            strokeDasharray={chartConfig.gridStyle.strokeDasharray}
            stroke={chartConfig.gridStyle.stroke}
            vertical={false}
          />
          <XAxis
            dataKey="monthLabel"
            interval={2}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
          />
          <YAxis
            domain={[0, maxDebt * 1.1]}
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            label={{
              value: "Balance",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: chartConfig.axisStyle
            }}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
            allowDecimals={false}
          />
          <Tooltip content={(props) => <ChartTooltip {...props} currencySymbol={currencySymbol} />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={chartConfig.legendStyle}
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
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#374151"
            strokeWidth={2}
            dot={false}
          />
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
  console.log('Generating chart data with:', {
    numberOfDebts: debts.length,
    payoffMonths: Math.max(...Object.values(payoffDetails).map(d => d.months))
  });

  const data = [];
  const maxMonths = 18; // Set maximum months to June 2026 (18 months from January 2025)

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