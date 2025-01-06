import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Target, DollarSign, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/strategies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { OverviewSection } from "./sections/OverviewSection";
import { StreakSection } from "./sections/StreakSection";
import { SimulatorSection } from "./sections/SimulatorSection";

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
  const totalSavings = extraPayment + oneTimeFundingTotal;
  const interestSaved = totalSavings * 0.2; // Simplified calculation for demo
  const monthsSaved = Math.floor(totalSavings / 100); // Simplified calculation

  useEffect(() => {
    setSimulatedExtra(extraPayment);
  }, [extraPayment]);

  // Fetch one-time funding count
  const { data: fundingCount } = useQuery({
    queryKey: ["oneTimeFundingCount", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from("one_time_funding")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_applied", false);

      if (error) {
        console.error("Error fetching one-time funding count:", error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (totalSavings >= 500 && !localStorage.getItem('milestone_500')) {
      toast({
        title: "🎉 Milestone Achieved!",
        description: "You've contributed £500 in extra payments!",
      });
      localStorage.setItem('milestone_500', 'true');
    }
  }, [totalSavings, toast]);

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
          totalSavings={totalSavings}
          interestSaved={interestSaved}
          monthsSaved={monthsSaved}
          currencySymbol={currencySymbol}
        />

        <StreakSection extraPayment={extraPayment} />

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