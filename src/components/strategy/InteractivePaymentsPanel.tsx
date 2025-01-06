import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Target, TrendingUp, Award, Calendar, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/strategies";

interface InteractivePaymentsPanelProps {
  extraPayment: number;
  oneTimeFundingTotal?: number;
  currencySymbol?: string;
  onOpenExtraPaymentDialog: () => void;
}

export const InteractivePaymentsPanel = ({
  extraPayment,
  oneTimeFundingTotal = 0,
  currencySymbol = "£",
  onOpenExtraPaymentDialog
}: InteractivePaymentsPanelProps) => {
  const { toast } = useToast();
  const [simulatedExtra, setSimulatedExtra] = useState(extraPayment);
  const [streak, setStreak] = useState(0);
  const totalSavings = extraPayment + oneTimeFundingTotal;
  const interestSaved = totalSavings * 0.2; // Simplified calculation for demo
  const monthsSaved = Math.floor(totalSavings / 100); // Simplified calculation

  // Simulated milestone check
  useEffect(() => {
    if (totalSavings >= 500 && !localStorage.getItem('milestone_500')) {
      toast({
        title: "🎉 Milestone Achieved!",
        description: "You've contributed £500 in extra payments!",
      });
      localStorage.setItem('milestone_500', 'true');
    }
  }, [totalSavings, toast]);

  // Simulate streak calculation
  useEffect(() => {
    const calculateStreak = () => {
      // This would normally come from payment history
      setStreak(extraPayment > 0 ? Math.floor(Math.random() * 5) + 1 : 0);
    };
    calculateStreak();
  }, [extraPayment]);

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Extra Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Extra Payments</span>
            <span className="font-semibold text-primary">
              {formatCurrency(totalSavings, currencySymbol)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Interest Saved</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(interestSaved, currencySymbol)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time Saved</span>
            <span className="font-semibold text-blue-600">
              {monthsSaved} months
            </span>
          </div>
        </div>

        {/* Streak Section */}
        {streak > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-blue-700">
                {streak} Month Streak!
              </span>
            </div>
            <Progress value={(streak / 12) * 100} className="h-2" />
            <p className="text-sm text-blue-600 mt-2">
              Keep it up! You're building great habits.
            </p>
          </div>
        )}

        {/* Simulator Section */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Savings Simulator
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Extra Payment Amount</span>
              <span>{formatCurrency(simulatedExtra, currencySymbol)}</span>
            </div>
            <Slider
              value={[simulatedExtra]}
              onValueChange={(value) => setSimulatedExtra(value[0])}
              max={1000}
              step={10}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              {simulatedExtra > extraPayment
                ? `Increasing your payment by ${formatCurrency(
                    simulatedExtra - extraPayment,
                    currencySymbol
                  )} could save you ${formatCurrency(
                    (simulatedExtra - extraPayment) * 0.2,
                    currencySymbol
                  )} in interest!`
                : "Try increasing your extra payment to see potential savings"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
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

        {/* Community Stats */}
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