import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { OverviewSection } from "./sections/OverviewSection";
import { StreakMetricsDisplay } from "./sections/StreakMetrics";
import { SimulatorSection } from "./sections/SimulatorSection";
import { calculateStreakMetrics } from "@/lib/utils/payment/streakCalculator";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { strategies } from "@/lib/strategies";
import { useDebts } from "@/hooks/use-debts";

const motivationalMessages = [
  "💡 Great progress! Keep up with those extra payments to become debt-free faster!",
  "💪 You're making smart financial choices. Every extra payment counts!",
  "🎯 Stay focused on your goal - financial freedom is within reach!",
  "⚡ Your commitment to extra payments is accelerating your debt payoff!",
  "🌟 You're ahead of the curve! Keep building those positive financial habits!"
];

interface InteractivePaymentsPanelProps {
  extraPayment: number;
  oneTimeFundingTotal?: number;
  currencySymbol?: string;
  onOpenExtraPaymentDialog: () => void;
  onExtraPaymentChange: (amount: number) => void;
  totalDebtValue: number;
}

export const InteractivePaymentsPanel = ({
  extraPayment,
  oneTimeFundingTotal = 0,
  currencySymbol = "£",
  onOpenExtraPaymentDialog,
  onExtraPaymentChange,
  totalDebtValue
}: InteractivePaymentsPanelProps) => {
  const { toast } = useToast();
  const [simulatedExtra, setSimulatedExtra] = useState(extraPayment);
  const { user } = useAuth();
  const [messageIndex, setMessageIndex] = useState(0);
  const { debts, profile } = useDebts();

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % motivationalMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSimulatedExtra(extraPayment);
  }, [extraPayment]);

  // Calculate payoff details using the same method as PayoffTimeline
  const payoffDetails = debts ? calculatePayoffDetails(
    debts,
    (debts.reduce((sum, debt) => sum + debt.minimum_payment, 0) || 0) + extraPayment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    []
  ) : null;

  // Find the latest payoff date
  const debtFreeDate = payoffDetails ? 
    Object.values(payoffDetails).reduce((latest, current) => {
      return latest > current.payoffDate ? latest : current.payoffDate;
    }, new Date()) : undefined;

  // Fetch payment history
  const { data: paymentHistory } = useQuery({
    queryKey: ["paymentHistory", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch one-time funding
  const { data: oneTimeFunding } = useQuery({
    queryKey: ["oneTimeFunding", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("one_time_funding")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_applied", false)
        .gte("payment_date", new Date().toISOString());

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const allDebtsFullyPaid = debts?.every(debt => debt.status === "paid") ?? false;

  const streakMetrics = calculateStreakMetrics(
    paymentHistory,
    oneTimeFunding,
    extraPayment,
    allDebtsFullyPaid
  );

  const totalExtraPayments = extraPayment + (oneTimeFundingTotal || 0);

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          ExtraPay Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <OverviewSection
          totalSavings={totalExtraPayments}
          interestSaved={streakMetrics.interestSaved}
          monthsSaved={streakMetrics.monthsSaved}
          currencySymbol={currencySymbol}
          debtFreeDate={debtFreeDate}
        />

        <StreakMetricsDisplay 
          metrics={streakMetrics}
          currencySymbol={currencySymbol}
        />

        <SimulatorSection
          simulatedExtra={simulatedExtra}
          setSimulatedExtra={setSimulatedExtra}
          extraPayment={extraPayment}
          currencySymbol={currencySymbol}
          onExtraPaymentChange={onExtraPaymentChange}
          maxValue={totalDebtValue}
        />

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            {motivationalMessages[messageIndex]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};