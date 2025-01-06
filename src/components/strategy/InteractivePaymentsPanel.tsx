import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Target, DollarSign, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { OverviewSection } from "./sections/OverviewSection";
import { StreakMetricsDisplay } from "./sections/StreakMetrics";
import { SimulatorSection } from "./sections/SimulatorSection";
import { calculateStreakMetrics } from "@/lib/utils/payment/streakCalculator";

interface InteractivePaymentsPanelProps {
  extraPayment: number;
  oneTimeFundingTotal?: number;
  currencySymbol?: string;
  onOpenExtraPaymentDialog: () => void;
  onExtraPaymentChange: (amount: number) => void;
}

export const InteractivePaymentsPanel = ({
  extraPayment,
  oneTimeFundingTotal = 0,
  currencySymbol = "£",
  onOpenExtraPaymentDialog,
  onExtraPaymentChange
}: InteractivePaymentsPanelProps) => {
  const { toast } = useToast();
  const [simulatedExtra, setSimulatedExtra] = useState(extraPayment);
  const { user } = useAuth();

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

  // Fetch debts to check if all are paid off
  const { data: debts } = useQuery({
    queryKey: ["debts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const allDebtsFullyPaid = debts?.every(debt => debt.status === "paid") ?? false;

  useEffect(() => {
    setSimulatedExtra(extraPayment);
  }, [extraPayment]);

  const streakMetrics = calculateStreakMetrics(
    paymentHistory,
    oneTimeFunding,
    extraPayment,
    allDebtsFullyPaid
  );

  useEffect(() => {
    if (streakMetrics.totalSaved >= 500 && !localStorage.getItem('milestone_500')) {
      toast({
        title: "🎉 Milestone Achieved!",
        description: "You've contributed £500 in extra payments!",
      });
      localStorage.setItem('milestone_500', 'true');
    }
  }, [streakMetrics.totalSaved, toast]);

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          ExtraPay Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <OverviewSection
          totalSavings={streakMetrics.totalSaved}
          interestSaved={streakMetrics.interestSaved}
          monthsSaved={streakMetrics.monthsSaved}
          currencySymbol={currencySymbol}
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
        />

        <div className="space-y-3">
          <Button
            onClick={onOpenExtraPaymentDialog}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Add Extra Payment
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Coming Soon!",
                description: "This feature will be available in a future update.",
              });
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule One-Time Payment
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 Users like you saved an average of {currencySymbol}750 last month through
            extra payments!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};