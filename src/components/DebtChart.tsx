import { Debt } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency, formatMonthYear } from "./debt/chart/chartUtils";
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
  currencySymbol = '£',
  oneTimeFundings = []
}: DebtChartProps) => {
  const { profile } = useProfile();
  
  const selectedStrategy = strategies.find(s => s.id === profile?.selected_strategy) || strategies[0];

  const payoffDetails = calculatePayoffDetails(
    debts,
    monthlyPayment,
    selectedStrategy,
    oneTimeFundings
  );

  const chartData = generateChartData(debts, payoffDetails, oneTimeFundings);
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
      className="w-full h-[400px] p-6 rounded-2xl bg-white"
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">Balance</h3>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7DD3FC" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#7DD3FC" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="monthLabel"
            interval={Math.floor(chartData.length / 6)}
            angle={0}
            textAnchor="middle"
            height={60}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
            tickMargin={10}
          />
          <YAxis
            domain={[0, maxDebt * 1.1]}
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={(props) => <ChartTooltip {...props} currencySymbol={currencySymbol} />} />
          
          <Area
            type="monotone"
            dataKey="Total"
            fill="url(#totalGradient)"
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={false}
          />

          {oneTimeFundings.map((funding, index) => {
            const date = new Date(funding.payment_date);
            const now = new Date();
            const monthsDiff = (date.getFullYear() - now.getFullYear()) * 12 + 
                            (date.getMonth() - now.getMonth());
            
            return (
              <ReferenceLine
                key={index}
                x={formatMonthYear(monthsDiff)}
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{
                  value: `+${currencySymbol}${funding.amount}`,
                  position: 'top',
                  fill: '#10B981',
                  fontSize: 12
                }}
              />
            );
          })}
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