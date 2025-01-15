import { Debt } from "@/lib/types/debt";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PayoffTimelineProps {
  debt: Debt;
  extraPayment: number;
}

export const PayoffTimeline = ({ debt, extraPayment }: PayoffTimelineProps) => {
  const { oneTimeFundings } = useOneTimeFunding();
  const { profile } = useProfile();
  
  console.log('PayoffTimeline: Starting calculation for debt:', {
    debtName: debt.name,
    balance: debt.balance,
    extraPayment,
    oneTimeFundings
  });

  const formattedFundings = oneTimeFundings.map(funding => ({
    amount: funding.amount,
    payment_date: new Date(funding.payment_date)
  }));

  const payoffDetails = unifiedDebtCalculationService.calculatePayoffDetails(
    [debt],
    debt.minimum_payment + extraPayment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    formattedFundings
  );

  const data = [];
  const debtBalances = new Map<string, number>();
  debtBalances.set(debt.id, debt.balance);
  
  const monthlyRate = debt.interest_rate / 1200;
  const totalPayment = debt.minimum_payment + extraPayment;
  const startDate = new Date();
  
  for (let month = 0; month <= payoffDetails[debt.id].months; month++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + month);
    
    const monthlyFundings = formattedFundings.filter(funding => {
      const fundingDate = funding.payment_date;
      return fundingDate.getMonth() === date.getMonth() &&
             fundingDate.getFullYear() === date.getFullYear();
    });
    
    const oneTimeFundingAmount = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
    const dataPoint: any = { date: date.toISOString() };
    
    const currentBalance = debtBalances.get(debt.id) || 0;
    if (currentBalance > 0) {
      const interest = currentBalance * monthlyRate;
      const newBalance = Math.max(0, currentBalance + interest - totalPayment - oneTimeFundingAmount);
      debtBalances.set(debt.id, newBalance);
      dataPoint[debt.name] = Number(newBalance.toFixed(2));
      dataPoint.interest = Number(interest.toFixed(2));
      dataPoint.principal = Number((totalPayment - interest).toFixed(2));
    } else {
      dataPoint[debt.name] = 0;
      dataPoint.interest = 0;
      dataPoint.principal = 0;
    }

    data.push(dataPoint);

    if ([...debtBalances.values()].every(balance => balance <= 0)) break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Payoff Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    year: '2-digit'
                  })}
                  tick={{ fontSize: 12 }}
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
                <Area
                  type="monotone"
                  dataKey={debt.name}
                  stroke="#34D399"
                  fillOpacity={1}
                  fill="url(#balanceGradient)"
                  name="Balance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};