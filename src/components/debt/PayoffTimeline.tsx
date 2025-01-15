import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Debt } from "@/lib/types";
import { useProfile } from "@/hooks/use-profile";
import { strategies } from "@/lib/strategies";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { format } from "date-fns";

interface PayoffTimelineProps {
  debt: Debt;
  extraPayment: number;
}

export const PayoffTimeline = ({ debt, extraPayment }: PayoffTimelineProps) => {
  const { profile } = useProfile();
  const { oneTimeFundings } = useOneTimeFunding();

  // Format one-time fundings for the calculation service
  const formattedFundings = oneTimeFundings.map(funding => ({
    amount: funding.amount,
    payment_date: new Date(funding.payment_date)
  }));

  console.log('Starting PayoffTimeline calculation with:', {
    debt: { name: debt.name, balance: debt.balance },
    extraPayment,
    oneTimeFundings: formattedFundings,
    strategy: profile?.selected_strategy
  });

  // Calculate payoff details with extra payments and one-time funding
  const payoffDetailsWithExtra = unifiedDebtCalculationService.calculatePayoffDetails(
    [debt],
    debt.minimum_payment + extraPayment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    formattedFundings
  );

  // Calculate baseline payoff details (minimum payments only, no extra payments or one-time funding)
  const payoffDetailsBaseline = unifiedDebtCalculationService.calculatePayoffDetails(
    [debt],
    debt.minimum_payment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    []
  );

  const data = [];
  const startDate = new Date();
  const maxMonths = Math.max(
    payoffDetailsBaseline[debt.id].months,
    payoffDetailsWithExtra[debt.id].months
  );

  let baselineBalance = debt.balance;
  let acceleratedBalance = debt.balance;
  const monthlyInterestRate = debt.interest_rate / 1200;

  for (let month = 0; month <= maxMonths; month++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + month);

    // Calculate baseline scenario (minimum payments only)
    const baselineInterest = baselineBalance * monthlyInterestRate;
    const baselinePayment = Math.min(debt.minimum_payment, baselineBalance + baselineInterest);
    baselineBalance = Math.max(0, baselineBalance + baselineInterest - baselinePayment);

    // Calculate accelerated scenario (with extra payments and one-time funding)
    const acceleratedInterest = acceleratedBalance * monthlyInterestRate;
    let acceleratedPayment = debt.minimum_payment + extraPayment;

    // Add any one-time funding for this month
    const monthFunding = formattedFundings.find(f => {
      const fundingDate = new Date(f.payment_date);
      return fundingDate.getMonth() === date.getMonth() &&
             fundingDate.getFullYear() === date.getFullYear();
    });
    
    if (monthFunding) {
      acceleratedPayment += monthFunding.amount;
    }

    acceleratedPayment = Math.min(acceleratedPayment, acceleratedBalance + acceleratedInterest);
    acceleratedBalance = Math.max(0, acceleratedBalance + acceleratedInterest - acceleratedPayment);

    data.push({
      date: format(date, 'MMM yyyy'),
      baseline: Number(baselineBalance.toFixed(2)),
      accelerated: Number(acceleratedBalance.toFixed(2))
    });

    if (baselineBalance === 0 && acceleratedBalance === 0) break;
  }

  const baselineMonths = payoffDetailsBaseline[debt.id].months;
  const acceleratedMonths = payoffDetailsWithExtra[debt.id].months;
  const monthsSaved = Math.max(0, baselineMonths - acceleratedMonths);
  const baselineInterest = payoffDetailsBaseline[debt.id].totalInterest;
  const acceleratedInterest = payoffDetailsWithExtra[debt.id].totalInterest;
  const interestSaved = Math.max(0, baselineInterest - acceleratedInterest);

  console.log('Final calculation results:', {
    baselineMonths,
    acceleratedMonths,
    monthsSaved,
    baselineInterest,
    acceleratedInterest,
    interestSaved,
    totalOneTimeFunding: formattedFundings.reduce((sum, f) => sum + f.amount, 0)
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Baseline: {debt.currency_symbol}{payload[0].value.toLocaleString()}
          </p>
          <p className="text-emerald-600">
            Accelerated: {debt.currency_symbol}{payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Debt Payoff Timeline
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Time Saved</p>
            <p className="text-xl font-bold text-blue-600">
              {monthsSaved} months
            </p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Interest Saved</p>
            <p className="text-xl font-bold text-emerald-600">
              {debt.currency_symbol}{interestSaved.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#2563eb"
                name="Baseline"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="accelerated"
                stroke="#10b981"
                name="Accelerated"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};