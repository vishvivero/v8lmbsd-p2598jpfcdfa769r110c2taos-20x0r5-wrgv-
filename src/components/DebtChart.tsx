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
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { generateChartData, formatCurrency, formatMonthYear } from "./debt/chart/chartUtils";
import { getGradientDefinitions, chartConfig, PASTEL_COLORS } from "./debt/chart/chartStyles";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

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
  const chartData = generateChartData(debts, monthlyPayment, oneTimeFundings);
  const gradients = getGradientDefinitions(debts);

  // Find months with one-time funding
  const fundingMonths = oneTimeFundings.map(funding => {
    const date = new Date(funding.payment_date);
    const now = new Date();
    const monthsDiff = (date.getFullYear() - now.getFullYear()) * 12 + 
                      (date.getMonth() - now.getMonth());
    return {
      month: monthsDiff,
      amount: funding.amount
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const oneTimeFunding = payload.find((p: any) => p.dataKey === 'oneTimeFunding');
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold mb-2">{label}</p>
          {oneTimeFunding && oneTimeFunding.value > 0 && (
            <p className="text-emerald-600 font-medium mb-2">
              One-time funding: {formatCurrency(oneTimeFunding.value, currencySymbol)}
            </p>
          )}
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey !== 'oneTimeFunding' && entry.value > 0) {
              return (
                <p key={index} style={{ color: entry.color }} className="flex justify-between">
                  <span>{entry.name}:</span>
                  <span className="ml-4 font-medium">
                    {formatCurrency(entry.value, currencySymbol)}
                  </span>
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  // Find the maximum debt value for scale calculation
  const maxDebt = Math.max(...chartData.map(data => 
    Object.values(data)
      .filter(value => typeof value === 'number' && value > 0)
      .reduce((max, value) => Math.max(max, value as number), 0)
  ));

  // Calculate minimum value for log scale (avoid zero)
  const minDebt = Math.max(1, maxDebt * 0.001);

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
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
          />
          <YAxis
            scale="log"
            domain={[minDebt, maxDebt * 1.1]}
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            label={{
              value: "Balance (Log Scale)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: chartConfig.axisStyle
            }}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={chartConfig.legendStyle}
          />

          {/* Reference lines for one-time funding */}
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
            <Area
              key={debt.id}
              type="monotone"
              dataKey={debt.name}
              stroke={PASTEL_COLORS[index % PASTEL_COLORS.length]}
              strokeWidth={2}
              dot={false}
              fill={`url(#gradient-${index})`}
              fillOpacity={0.6}
              stackId="1"
            />
          ))}
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#374151"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            strokeOpacity={0.7}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};