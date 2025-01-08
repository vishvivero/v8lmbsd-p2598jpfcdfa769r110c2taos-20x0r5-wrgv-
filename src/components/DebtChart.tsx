import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Debt } from '@/lib/types';
import { calculatePayoffDetails } from '@/lib/utils/payment/paymentCalculations';
import { strategies } from '@/lib/strategies';
import { useProfile } from '@/hooks/use-profile';

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol: string;
  oneTimeFundings: Array<{
    payment_date: string;
    amount: number;
  }>;
}

export const DebtChart = ({ debts, monthlyPayment, currencySymbol, oneTimeFundings }: DebtChartProps) => {
  const { profile } = useProfile();
  
  if (!debts || debts.length === 0) return null;

  console.log('Generating chart data with:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    oneTimeFundings
  });

  // Calculate payoff details
  const payoffDetails = calculatePayoffDetails(
    debts,
    monthlyPayment,
    strategies.find(s => s.id === profile?.selected_strategy) || strategies[0],
    oneTimeFundings
  );

  console.log('Payoff calculation completed:', {
    totalMonths: Math.max(...Object.values(payoffDetails).map(d => d.months)),
    finalBalances: Object.fromEntries(debts.map(d => [d.id, payoffDetails[d.id]?.finalBalance || 0])),
    payoffDates: Object.fromEntries(debts.map(d => [d.id, payoffDetails[d.id]?.payoffDate.toISOString()]))
  });

  // Generate chart data points
  const chartData = [];
  const startDate = new Date();
  const maxMonths = Math.max(...Object.values(payoffDetails).map(d => d.months));

  for (let month = 0; month <= maxMonths; month++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + month);

    const dataPoint: any = {
      name: date.toLocaleDateString('default', { month: 'short', year: '2-digit' }),
      total: 0,
    };

    // Add balance for each debt
    debts.forEach(debt => {
      const details = payoffDetails[debt.id];
      if (!details) return;

      const monthlyBalance = details.balanceSchedule[month] || 0;
      dataPoint[debt.name] = monthlyBalance;
      dataPoint.total += monthlyBalance;
    });

    // Add one-time funding markers
    oneTimeFundings.forEach(funding => {
      const fundingDate = new Date(funding.payment_date);
      if (
        fundingDate.getMonth() === date.getMonth() &&
        fundingDate.getFullYear() === date.getFullYear()
      ) {
        dataPoint.oneTimeFunding = funding.amount;
      }
    });

    chartData.push(dataPoint);
  }

  console.log('Chart data generated:', {
    totalPoints: chartData.length,
    monthsToPayoff: maxMonths,
    finalBalance: chartData[chartData.length - 1]?.total || 0
  });

  const colors = ['#9333ea', '#f97316', '#22c55e'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          height={60}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value, currencySymbol)}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value, currencySymbol)}
          labelStyle={{ color: '#111827' }}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem'
          }}
        />
        <Legend />
        
        {/* Debt balance lines */}
        {debts.map((debt, index) => (
          <Line
            key={debt.id}
            type="monotone"
            dataKey={debt.name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
        
        {/* Total balance line */}
        <Line
          type="monotone"
          dataKey="total"
          stroke="#9ca3af"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
        
        {/* One-time funding markers */}
        {chartData.map((point, index) => {
          if (point.oneTimeFunding) {
            return (
              <ReferenceLine
                key={`funding-${index}`}
                x={point.name}
                stroke="#22c55e"
                strokeDasharray="3 3"
                label={{
                  value: `+${currencySymbol}${point.oneTimeFunding.toLocaleString()}`,
                  position: 'top',
                  fill: '#22c55e',
                  fontSize: 12
                }}
              />
            );
          }
          return null;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};