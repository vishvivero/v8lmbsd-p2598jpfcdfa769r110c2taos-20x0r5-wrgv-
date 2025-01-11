import { Area, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { ChartData } from "./types";
import { formatCurrency, formatMonthYear } from "./chartUtils";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { ReferenceLine } from "recharts";

interface ChartAreaProps {
  data: ChartData[];
  maxDebt: number;
  currencySymbol: string;
  oneTimeFundings: OneTimeFunding[];
}

export const ChartArea = ({ data, maxDebt, currencySymbol, oneTimeFundings }: ChartAreaProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
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
          interval={Math.floor(data.length / 6)}
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
  );
};