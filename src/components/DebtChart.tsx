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
import { strategies, Strategy } from "@/lib/strategies";  // Added Strategy import
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

  console.log('Calculating payoff details:', {
    debts: debts.map(d => ({ name: d.name, balance: d.balance, rate: d.interest_rate })),
    monthlyPayment,
    strategy: selectedStrategy.name,
    payoffDetails
  });

  const chartData = generateChartData(debts, payoffDetails, monthlyPayment, selectedStrategy, oneTimeFundings);
  const { maxDebt } = calculateChartDomain(chartData);

  console.log('Generated chart data:', {
    numberOfPoints: chartData.length,
    firstPoint: chartData[0],
    lastPoint: chartData[chartData.length - 1],
    maxDebt
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
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
) => {
  const maxMonths = Math.max(...Object.values(payoffDetails).map(d => d.months));
  const data = [];
  const balances = new Map(debts.map(debt => [debt.id, debt.balance]));
  let availablePayment = monthlyPayment;

  console.log('Starting chart data generation:', {
    initialBalances: Object.fromEntries(balances),
    monthlyPayment,
    maxMonths
  });

  for (let month = 0; month <= maxMonths; month++) {
    const point: any = {
      month,
      monthLabel: formatMonthYear(month),
      Total: 0
    };

    // Sort debts according to strategy
    const sortedDebts = strategy.calculate([...debts]);
    
    // Reset available payment for this month
    availablePayment = monthlyPayment;

    // Add any one-time funding for this month
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + month);
    const monthlyFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });
    
    availablePayment += monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);

    // Calculate new balances after payments and interest
    let totalBalance = 0;
    
    for (const debt of sortedDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      if (currentBalance <= 0) continue;

      // Calculate monthly interest
      const monthlyRate = debt.interest_rate / 1200;
      const interest = currentBalance * monthlyRate;
      
      // Calculate payment for this debt
      const minPayment = Math.min(debt.minimum_payment, currentBalance + interest);
      let payment = minPayment;
      
      // If this is the highest priority debt and we have extra payment available
      if (debt.id === sortedDebts[0].id && availablePayment > minPayment) {
        const extraPayment = Math.min(
          availablePayment - minPayment,
          currentBalance + interest - minPayment
        );
        payment += extraPayment;
      }

      // Update available payment
      availablePayment -= payment;

      // Calculate new balance
      const newBalance = Math.max(0, currentBalance + interest - payment);
      balances.set(debt.id, newBalance);
      
      point[debt.name] = newBalance;
      totalBalance += newBalance;
    }

    point.Total = totalBalance;
    data.push(point);
    
    // Break if all debts are paid off
    if (totalBalance <= 0) break;
  }

  console.log('Chart data generation complete:', {
    points: data.length,
    finalBalances: Object.fromEntries(balances)
  });

  return data;
};