import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/components/debt/chart/chartUtils";

interface PaymentTrendsChartProps {
  payments: any[];
}

export const PaymentTrendsChart = ({ payments }: PaymentTrendsChartProps) => {
  console.log('Rendering payment trends chart with data:', payments);

  const paymentData = payments?.map(payment => ({
    date: new Date(payment.payment_date).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    }),
    amount: Number(payment.total_payment),
    isRedistributed: payment.is_redistributed
  })) || [];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={paymentData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => formatCurrency(value, '£')}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, '£')}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '8px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            name="Payment Amount"
            stroke="#34D399"
            strokeWidth={2}
            dot={(props) => {
              const isRedistributed = paymentData[props.index]?.isRedistributed;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={4}
                  fill={isRedistributed ? "#9CA3AF" : "#34D399"}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};