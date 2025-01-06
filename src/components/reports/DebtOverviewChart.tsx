import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Debt } from "@/lib/types/debt";

interface DebtOverviewChartProps {
  debts: Debt[];
}

export const DebtOverviewChart = ({ debts }: DebtOverviewChartProps) => {
  const debtData = debts?.map(debt => ({
    name: debt.name,
    balance: Number(debt.balance),
    interestRate: Number(debt.interest_rate),
  })) || [];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={debtData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="balance" fill="#34D399" name="Balance" />
          <Bar dataKey="interestRate" fill="#818CF8" name="Interest Rate %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};