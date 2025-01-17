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

  // Calculate total minimum payment required
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const totalMonthlyPayment = totalMinimumPayment + extraPayment;

  console.log('Payment calculations:', {
    totalMinimumPayment,
    extraPayment,
    totalMonthlyPayment
  });

  // Calculate baseline scenario (minimum payments only)
  const payoffDetailsBaseline = unifiedDebtCalculationService.calculatePayoffDetails(
    debts,
    totalMinimumPayment,
    selectedStrategy,
    []
  );

  // Calculate accelerated scenario (with extra payments and funding)
  const payoffDetailsWithExtra = unifiedDebtCalculationService.calculatePayoffDetails(
    debts,
    totalMonthlyPayment,
    selectedStrategy,
    formattedFundings
  );

  // Find the latest payoff dates from both scenarios
  const baselineLatestDate = Object.values(payoffDetailsBaseline)
    .reduce((latest, detail) => detail.payoffDate > latest ? detail.payoffDate : latest, new Date());
  
  const acceleratedLatestDate = Object.values(payoffDetailsWithExtra)
    .reduce((latest, detail) => detail.payoffDate > latest ? detail.payoffDate : latest, new Date());

  console.log('Scenario payoff dates:', {
    baselineLatestDate: baselineLatestDate.toISOString(),
    acceleratedLatestDate: acceleratedLatestDate.toISOString()
  });

  // Calculate months between start and end dates
  const startDate = new Date();
  const baselineMonths = Math.ceil((baselineLatestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const acceleratedMonths = Math.ceil((acceleratedLatestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const monthsSaved = baselineMonths - acceleratedMonths;

  console.log('Timeline calculations:', {
    baselineMonths,
    acceleratedMonths,
    monthsSaved
  });

  // Generate timeline data
  const data = [];
  const balances = new Map<string, number>();
  const acceleratedBalances = new Map<string, number>();

  // Initialize balances
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    acceleratedBalances.set(debt.id, debt.balance);
  });

  // Generate timeline data for the full payoff period
  const totalMonths = Math.max(baselineMonths, acceleratedMonths);
  
  for (let month = 0; month <= totalMonths; month++) {
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

    // Calculate baseline scenario
    let totalBaselineBalance = 0;
    const sortedDebtsBaseline = selectedStrategy.calculate([...debts]);
    let remainingBaselinePayment = totalMinimumPayment;

    sortedDebtsBaseline.forEach(debt => {
      const baselineBalance = balances.get(debt.id) || 0;
      if (baselineBalance > 0) {
        const monthlyRate = debt.interest_rate / 1200;
        const baselineInterest = baselineBalance * monthlyRate;
        const payment = Math.min(remainingBaselinePayment, debt.minimum_payment);
        const newBaselineBalance = Math.max(0, baselineBalance + baselineInterest - payment);
        
        remainingBaselinePayment = Math.max(0, remainingBaselinePayment - payment);
        balances.set(debt.id, newBaselineBalance);
        totalBaselineBalance += newBaselineBalance;
      }
    });
    dataPoint.baselineBalance = Number(totalBaselineBalance.toFixed(2));

    // Calculate accelerated scenario with proper payment allocation
    let totalAcceleratedBalance = 0;
    const sortedDebtsAccelerated = selectedStrategy.calculate([...debts]);
    let remainingAcceleratedPayment = totalMonthlyPayment + oneTimeFundingAmount;

    // First apply minimum payments
    sortedDebtsAccelerated.forEach(debt => {
      const acceleratedBalance = acceleratedBalances.get(debt.id) || 0;
      if (acceleratedBalance > 0) {
        const monthlyRate = debt.interest_rate / 1200;
        const acceleratedInterest = acceleratedBalance * monthlyRate;
        const minPayment = Math.min(debt.minimum_payment, acceleratedBalance + acceleratedInterest);
        remainingAcceleratedPayment -= minPayment;
        
        // Apply minimum payment
        let newBalance = acceleratedBalance + acceleratedInterest - minPayment;
        acceleratedBalances.set(debt.id, newBalance);
      }
    });

    // Then apply extra payments to highest priority debt
    if (remainingAcceleratedPayment > 0) {
      for (const debt of sortedDebtsAccelerated) {
        const currentBalance = acceleratedBalances.get(debt.id) || 0;
        if (currentBalance > 0) {
          const extraPayment = Math.min(remainingAcceleratedPayment, currentBalance);
          const newBalance = Math.max(0, currentBalance - extraPayment);
          acceleratedBalances.set(debt.id, newBalance);
          remainingAcceleratedPayment = Math.max(0, remainingAcceleratedPayment - extraPayment);
          
          if (remainingAcceleratedPayment <= 0) break;
        }
      }
    }

    // Calculate total accelerated balance
    totalAcceleratedBalance = Array.from(acceleratedBalances.values()).reduce((sum, balance) => sum + balance, 0);
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
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({format(baselineLatestDate, 'MMMM yyyy')})
              </span>
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
                <p className="text-sm font-medium text-muted-foreground">Original Term</p>
                <p className="text-2xl font-bold">
                  {baselineMonths} months
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
                  <Tooltip content={CustomTooltip} />
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