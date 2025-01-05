import { Debt } from "@/lib/types/debt";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { strategies } from "@/lib/strategies";

interface PayoffTimelineProps {
  debt: Debt;
  extraPayment: number;
}

export const PayoffTimeline = ({ debt, extraPayment }: PayoffTimelineProps) => {
  // Use the same calculation method as the main debt overview
  const payoffDetails = calculatePayoffDetails(
    [debt],
    debt.minimum_payment + extraPayment,
    strategies.find(s => s.id === 'avalanche') || strategies[0],
    []
  );

  console.log('PayoffTimeline calculation for', debt.name, {
    minimumPayment: debt.minimum_payment,
    extraPayment,
    payoffDetails
  });

  // Generate timeline data points
  const data = [];
  let currentBalance = debt.balance;
  const monthlyRate = debt.interest_rate / 1200;
  
  for (let month = 0; month <= payoffDetails[debt.id].months; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    
    const monthlyPayment = debt.minimum_payment + (month === 0 ? extraPayment : 0);
    const interest = currentBalance * monthlyRate;
    currentBalance = Math.max(0, currentBalance + interest - monthlyPayment);

    data.push({
      date: date.toISOString(),
      balance: Number(currentBalance.toFixed(2)),
      balanceWithExtra: extraPayment > 0 ? Number(currentBalance.toFixed(2)) : undefined
    });

    if (currentBalance <= 0) break;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            tickFormatter={(value) => `${debt.currency_symbol}${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${debt.currency_symbol}${Number(value).toLocaleString()}`, "Balance"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={false}
          />
          {extraPayment > 0 && (
            <Line 
              type="monotone" 
              dataKey="balanceWithExtra" 
              stroke="#16a34a" 
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};