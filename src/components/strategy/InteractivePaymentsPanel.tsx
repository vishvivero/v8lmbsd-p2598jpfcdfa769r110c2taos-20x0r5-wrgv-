import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Target, Trophy, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { OverviewSection } from "./sections/OverviewSection";
import { StreakMetricsDisplay } from "./sections/StreakMetrics";
import { SimulatorSection } from "./sections/SimulatorSection";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % motivationalMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSimulatedExtra(extraPayment);
  }, [extraPayment]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-primary" />
            ExtraPay Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <OverviewSection
            totalSavings={extraPayment + oneTimeFundingTotal}
            interestSaved={paymentHistory?.reduce((sum, payment) => sum + Number(payment.total_payment), 0) || 0}
            monthsSaved={Math.floor((extraPayment / totalDebtValue) * 12) || 0}
            currencySymbol={currencySymbol}
          />

          <StreakMetricsDisplay 
            metrics={{
              currentStreak: 5,
              longestStreak: 10,
              totalSavings: extraPayment + oneTimeFundingTotal,
              averageExtra: extraPayment
            }}
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

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20"
          >
            <p className="text-sm text-gray-300">
              {motivationalMessages[messageIndex]}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};