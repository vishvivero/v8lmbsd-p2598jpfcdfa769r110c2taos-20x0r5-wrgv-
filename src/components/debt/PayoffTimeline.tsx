import { Debt } from "@/lib/types/debt";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
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

  // Calculate payoff details with and without extra payments/funding
  const payoffDetailsWithExtra = unifiedDebtCalculationService.calculatePayoffDetails(
    [debt],
    debt.minimum_payment + extraPayment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    formattedFundings
  );

  const payoffDetailsBaseline = unifiedDebtCalculationService.calculatePayoffDetails(
    [debt],
    debt.minimum_payment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    []
  );

  const data = [];
  const baselineBalances = new Map<string, number>();
  const acceleratedBalances = new Map<string, number>();
  baselineBalances.set(debt.id, debt.balance);
  acceleratedBalances.set(debt.id, debt.balance);
  
  const monthlyRate = debt.interest_rate / 1200;
  const totalPayment = debt.minimum_payment + extraPayment;
  const startDate = new Date();
  
  // Always use the baseline timeline length
  const timelineMonths = payoffDetailsBaseline[debt.id].months;
  
  // Calculate data points for both timelines
  for (let month = 0; month <= timelineMonths; month++) {
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
    const baselineBalance = baselineBalances.get(debt.id) || 0;
    if (baselineBalance > 0) {
      const baselineInterest = baselineBalance * monthlyRate;
      const newBaselineBalance = Math.max(0, baselineBalance + baselineInterest - debt.minimum_payment);
      baselineBalances.set(debt.id, newBaselineBalance);
      dataPoint.baselineBalance = Number(newBaselineBalance.toFixed(2));
    } else {
      dataPoint.baselineBalance = 0;
    }

    // Calculate accelerated scenario
    const acceleratedBalance = acceleratedBalances.get(debt.id) || 0;
    if (acceleratedBalance > 0) {
      const acceleratedInterest = acceleratedBalance * monthlyRate;
      const newAcceleratedBalance = Math.max(0, acceleratedBalance + acceleratedInterest - totalPayment - oneTimeFundingAmount);
      acceleratedBalances.set(debt.id, newAcceleratedBalance);
      dataPoint.acceleratedBalance = Number(newAcceleratedBalance.toFixed(2));
      
      if (oneTimeFundingAmount > 0) {
        dataPoint.oneTimePayment = oneTimeFundingAmount;
      }
    } else {
      dataPoint.acceleratedBalance = 0;
    }

    data.push(dataPoint);
  }

  // Calculate time and money saved
  const baselineMonths = payoffDetailsBaseline[debt.id].months;
  const acceleratedMonths = payoffDetailsWithExtra[debt.id].months;
  const monthsSaved = baselineMonths - acceleratedMonths;
  const interestSaved = payoffDetailsBaseline[debt.id].totalInterest - payoffDetailsWithExtra[debt.id].totalInterest;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold mb-2">{format(new Date(label), 'MMMM yyyy')}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Original Balance: {debt.currency_symbol}{payload[0].value.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600">
              Accelerated Balance: {debt.currency_symbol}{payload[1].value.toLocaleString()}
            </p>
            {payload[1].payload.oneTimePayment && (
              <p className="text-sm text-purple-600">
                One-time Payment: {debt.currency_symbol}{payload[1].payload.oneTimePayment.toLocaleString()}
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
              Payoff Timeline
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
                <p className="text-sm font-medium text-muted-foreground">Interest Saved</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {debt.currency_symbol}{interestSaved.toLocaleString()}
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
                    tickFormatter={(value) => `${debt.currency_symbol}${value.toLocaleString()}`}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={{ stroke: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {/* Add vertical lines for one-time payments */}
                  {formattedFundings.map((funding, index) => (
                    <ReferenceLine
                      key={index}
                      x={format(funding.payment_date, 'MMM yyyy')}
                      stroke="#9333EA"
                      strokeDasharray="3 3"
                      label={{
                        value: `${debt.currency_symbol}${funding.amount}`,
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