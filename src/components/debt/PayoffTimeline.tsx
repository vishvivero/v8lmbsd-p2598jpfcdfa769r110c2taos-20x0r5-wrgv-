import { Debt } from "@/lib/types/debt";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { useProfile } from "@/hooks/use-profile";

interface PayoffTimelineProps {
  debt: Debt;
  extraPayment: number;
}

const COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#ea580c", // orange
];

export const PayoffTimeline = ({ debt, extraPayment }: PayoffTimelineProps) => {
  const { oneTimeFundings } = useOneTimeFunding();
  const { profile } = useProfile();
  
  console.log('PayoffTimeline: Starting calculation for debt:', {
    debtName: debt.name,
    balance: debt.balance,
    extraPayment,
    oneTimeFundings
  });

  // Convert oneTimeFundings to the correct format
  const formattedFundings = oneTimeFundings.map(funding => ({
    amount: funding.amount,
    payment_date: new Date(funding.payment_date)
  }));

  // Use the unified calculation service for consistent calculations
  const payoffDetails = unifiedDebtCalculationService.calculatePayoffDetails(
    [debt],
    debt.minimum_payment + extraPayment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    formattedFundings
  );

  console.log('PayoffTimeline: Calculation completed:', {
    debtName: debt.name,
    payoffMonths: payoffDetails[debt.id].months,
    payoffDate: payoffDetails[debt.id].payoffDate.toISOString(),
    totalInterest: payoffDetails[debt.id].totalInterest
  });

  // Generate timeline data points using the unified calculation
  const data = [];
  const debtBalances = new Map<string, number>();
  debtBalances.set(debt.id, debt.balance);
  
  const monthlyRate = debt.interest_rate / 1200;
  const totalPayment = debt.minimum_payment + extraPayment;
  const startDate = new Date();
  
  for (let month = 0; month <= payoffDetails[debt.id].months; month++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + month);
    
    // Check for one-time funding in this month
    const monthlyFundings = formattedFundings.filter(funding => {
      const fundingDate = funding.payment_date;
      return fundingDate.getMonth() === date.getMonth() &&
             fundingDate.getFullYear() === date.getFullYear();
    });
    
    const oneTimeFundingAmount = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
    
    // Calculate new balances for each debt
    const dataPoint: any = { date: date.toISOString() };
    
    const currentBalance = debtBalances.get(debt.id) || 0;
    if (currentBalance > 0) {
      const interest = currentBalance * monthlyRate;
      const newBalance = Math.max(0, currentBalance + interest - totalPayment - oneTimeFundingAmount);
      debtBalances.set(debt.id, newBalance);
      dataPoint[debt.name] = Number(newBalance.toFixed(2));
    } else {
      dataPoint[debt.name] = 0;
    }

    data.push(dataPoint);

    // Break if all debts are paid off
    if ([...debtBalances.values()].every(balance => balance <= 0)) break;
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
            formatter={(value: number) => [
              `${debt.currency_symbol}${value.toLocaleString()}`, 
              "Balance"
            ]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line 
            name={debt.name}
            type="monotone" 
            dataKey={debt.name}
            stroke={COLORS[0]}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};