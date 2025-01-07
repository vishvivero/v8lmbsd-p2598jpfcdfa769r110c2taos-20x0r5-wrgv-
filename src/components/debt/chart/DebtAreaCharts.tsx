import { Area, Line } from "recharts";
import { PASTEL_COLORS } from "./chartStyles";
import { Debt } from "@/lib/types";

interface DebtAreaChartsProps {
  debts: Debt[];
}

export const DebtAreaCharts = ({ debts }: DebtAreaChartsProps) => {
  return (
    <>
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
        dataKey="total"
        stroke="#374151"
        strokeWidth={2}
        dot={false}
        strokeDasharray="5 5"
        strokeOpacity={0.7}
      />
    </>
  );
};