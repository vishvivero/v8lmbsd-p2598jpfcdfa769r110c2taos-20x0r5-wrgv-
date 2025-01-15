import { Debt } from "@/lib/types/debt";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, addMonths } from "date-fns";
import { DollarSign, Calendar, TrendingDown } from "lucide-react";

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
  
  // Calculate data points for the timeline
  for (let month = 0; month <= Math.min(payoffDetails[debt.id].months, 360); month++) {
    const date = addMonths(startDate, month);
    
    const monthlyFundings = formattedFundings.filter(funding => {
      const fundingDate = funding.payment_date;
      return fundingDate.getMonth() === date.getMonth() &&
             fundingDate.getFullYear() === date.getFullYear();
    });
    
    const oneTimeFundingAmount = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
    const dataPoint: any = {
      date: date.toISOString(),
      formattedDate: format(date, 'MMM yyyy')
    };
    
    const currentBalance = debtBalances.get(debt.id) || 0;
    if (currentBalance > 0) {
      const interest = currentBalance * monthlyRate;
      const newBalance = Math.max(0, currentBalance + interest - totalPayment - oneTimeFundingAmount);
      debtBalances.set(debt.id, newBalance);
      dataPoint.balance = Number(newBalance.toFixed(2));
      dataPoint.interest = Number(interest.toFixed(2));
      dataPoint.principal = Number((totalPayment - interest).toFixed(2));
      
      if (oneTimeFundingAmount > 0) {
        dataPoint.oneTimePayment = oneTimeFundingAmount;
      }
    } else {
      dataPoint.balance = 0;
      dataPoint.interest = 0;
      dataPoint.principal = 0;
    }

    data.push(dataPoint);

    if ([...debtBalances.values()].every(balance => balance <= 0)) break;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold mb-2">{format(new Date(label), 'MMMM yyyy')}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Balance: {debt.currency_symbol}{payload[0].value.toLocaleString()}
            </p>
            {payload[0].payload.oneTimePayment && (
              <p className="text-sm text-emerald-600">
                One-time Payment: {debt.currency_symbol}{payload[0].payload.oneTimePayment.toLocaleString()}
              </p>
            )}
            <p className="text-sm text-gray-600">
              Interest: {debt.currency_symbol}{payload[0].payload.interest.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Principal: {debt.currency_symbol}{payload[0].payload.principal.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-emerald-500" />
            Payoff Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="formattedDate"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${debt.currency_symbol}${value.toLocaleString()}`}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#34D399"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#balanceGradient)"
                  name="Balance"
                  dot={false}
                  activeDot={{ r: 6, fill: "#34D399", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};