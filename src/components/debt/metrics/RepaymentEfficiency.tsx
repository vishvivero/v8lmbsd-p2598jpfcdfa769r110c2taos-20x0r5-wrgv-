import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Percent } from "lucide-react";

interface RepaymentEfficiencyProps {
  interestPercentage: number;
  principalPercentage: number;
}

export const RepaymentEfficiency = ({
  interestPercentage,
  principalPercentage,
}: RepaymentEfficiencyProps) => {
  const data = [
    { name: "Interest", value: interestPercentage },
    { name: "Principal", value: principalPercentage },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <Percent className="w-5 h-5 text-emerald-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Payment Breakdown
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {interestPercentage.toFixed(0)}% goes to interest, {principalPercentage.toFixed(0)}% reduces debt
          </p>
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};