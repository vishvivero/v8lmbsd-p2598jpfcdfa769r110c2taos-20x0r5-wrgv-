import { Debt } from "@/lib/types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, addMonths } from "date-fns";
import { TrendingDown } from "lucide-react";

interface PayoffTimelineProps {
  debts: Debt[];
  extraPayment: number;
}

export const PayoffTimeline = ({ debts, extraPayment }: PayoffTimelineProps) => {
  const { oneTimeFundings } = useOneTimeFunding();
  const { profile } = useProfile();
  
  console.log('PayoffTimeline: Starting calculation for debts:', {
    totalDebts: debts.length,
    extraPayment,
    oneTimeFundings
  });

  const formattedFundings = oneTimeFundings.map(funding => ({
    amount: funding.amount,
    payment_date: new Date(funding.payment_date)
  }));

  const selectedStrategy = strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0];

  // Calculate payoff details with and without extra payments/funding
  const payoffDetailsWithExtra = unifiedDebtCalculationService.calculatePayoffDetails(
    debts,
    debts.reduce((sum, debt) => sum + debt.minimum_payment, 0) + extraPayment,
    selectedStrategy,
    formattedFundings
  );

  const payoffDetailsBaseline = unifiedDebtCalculationService.calculatePayoffDetails(
    debts,
    debts.reduce((sum, debt) => sum + debt.minimum_payment, 0),
    selectedStrategy,
    []
  );

  // Find the longest payoff timeline
  const maxMonths = Math.max(...Object.values(payoffDetailsBaseline).map(detail => detail.months));
  const startDate = new Date();
  
  // Initialize data structure for chart
  const data = [];
  const balances = new Map(debts.map(debt => [debt.id, debt.balance]));
  const acceleratedBalances = new Map(debts.map(debt => [debt.id, debt.balance]));
  
  // Calculate total interest saved across all debts
  const totalInterestSaved = debts.reduce((sum, debt) => {
    return sum + (payoffDetailsBaseline[debt.id].totalInterest - payoffDetailsWithExtra[debt.id].totalInterest);
  }, 0);

  // Calculate total months saved
  const maxMonthsBaseline = Math.max(...Object.values(payoffDetailsBaseline).map(d => d.months));
  const maxMonthsAccelerated = Math.max(...Object.values(payoffDetailsWithExtra).map(d => d.months));
  const monthsSaved = maxMonthsBaseline - maxMonthsAccelerated;

  // Generate timeline data
  for (let month = 0; month <= maxMonths; month++) {
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

    // Calculate baseline scenario for all debts
    let totalBaselineBalance = 0;
    debts.forEach(debt => {
      const baselineBalance = balances.get(debt.id) || 0;
      if (baselineBalance > 0) {
        const monthlyRate = debt.interest_rate / 1200;
        const baselineInterest = baselineBalance * monthlyRate;
        const newBaselineBalance = Math.max(0, baselineBalance + baselineInterest - debt.minimum_payment);
        balances.set(debt.id, newBaselineBalance);
        totalBaselineBalance += newBaselineBalance;
      }
    });
    dataPoint.baselineBalance = Number(totalBaselineBalance.toFixed(2));

    // Calculate accelerated scenario for all debts
    let totalAcceleratedBalance = 0;
    const sortedDebts = selectedStrategy.calculate([...debts]);
    let remainingExtraPayment = extraPayment + oneTimeFundingAmount;

    sortedDebts.forEach(debt => {
      const acceleratedBalance = acceleratedBalances.get(debt.id) || 0;
      if (acceleratedBalance > 0) {
        const monthlyRate = debt.interest_rate / 1200;
        const acceleratedInterest = acceleratedBalance * monthlyRate;
        const payment = debt.minimum_payment + (remainingExtraPayment > 0 ? remainingExtraPayment : 0);
        const newAcceleratedBalance = Math.max(0, acceleratedBalance + acceleratedInterest - payment);
        
        remainingExtraPayment = Math.max(0, remainingExtraPayment - (acceleratedBalance + acceleratedInterest));
        acceleratedBalances.set(debt.id, newAcceleratedBalance);
        totalAcceleratedBalance += newAcceleratedBalance;
      }
    });
    dataPoint.acceleratedBalance = Number(totalAcceleratedBalance.toFixed(2));

    if (oneTimeFundingAmount > 0) {
      dataPoint.oneTimePayment = oneTimeFundingAmount;
    }

    data.push(dataPoint);
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold mb-2">{format(new Date(label), 'MMMM yyyy')}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Original Balance: {debts[0].currency_symbol}{payload[0].value.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600">
              Accelerated Balance: {debts[0].currency_symbol}{payload[1].value.toLocaleString()}
            </p>
            {payload[1].payload.oneTimePayment && (
              <p className="text-sm text-purple-600">
                One-time Payment: {debts[0].currency_symbol}{payload[1].payload.oneTimePayment.toLocaleString()}
              </p>
            )}
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
          <CardTitle className="text-xl font-bold">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-500" />
              Combined Debt Payoff Timeline
            </div>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {monthsSaved > 0 && (
              <span className="text-emerald-600">
                {monthsSaved} months faster
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {monthsSaved} months
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Interest Saved</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {debts[0].currency_symbol}{totalInterestSaved.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="acceleratedGradient" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(value) => `${debts[0].currency_symbol}${value.toLocaleString()}`}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={{ stroke: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {formattedFundings.map((funding, index) => (
                    <ReferenceLine
                      key={index}
                      x={format(funding.payment_date, 'MMM yyyy')}
                      stroke="#9333EA"
                      strokeDasharray="3 3"
                      label={{
                        value: `${debts[0].currency_symbol}${funding.amount}`,
                        position: 'top',
                        fill: '#9333EA',
                        fontSize: 12
                      }}
                    />
                  ))}
                  
                  <Area
                    type="monotone"
                    dataKey="baselineBalance"
                    name="Original Timeline"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#baselineGradient)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="acceleratedBalance"
                    name="Accelerated Timeline"
                    stroke="#34D399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#acceleratedGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};