import { Award, Flame, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/strategies";

interface StreakSectionProps {
  extraPayment: number;
}

export const StreakSection = ({ extraPayment }: StreakSectionProps) => {
  const [streak, setStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const { user } = useAuth();

  // Fetch payment history to calculate streak
  const { data: paymentHistory } = useQuery({
    queryKey: ["paymentHistory", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching payment history:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch one-time funding data
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

      if (error) {
        console.error("Error fetching one-time funding:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate streak and savings
  useEffect(() => {
    const calculateMetrics = () => {
      console.log('Calculating metrics with:', {
        paymentHistory,
        oneTimeFunding,
        extraPayment
      });

      if (!paymentHistory?.length && !oneTimeFunding?.length && extraPayment <= 0) {
        console.log('No payment history, one-time funding, or extra payment - resetting metrics');
        setStreak(0);
        setTotalSaved(0);
        return;
      }

      // Calculate consecutive months with payments
      let currentStreak = 0;
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      // Sort payments by date descending
      const sortedPayments = [...(paymentHistory || [])].sort((a, b) => 
        new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
      );

      console.log('Sorted payments:', sortedPayments);

      // Check if there's a payment in the last month
      const hasRecentPayment = sortedPayments.some(payment => {
        const paymentDate = new Date(payment.payment_date);
        const isRecent = paymentDate >= lastMonth;
        console.log('Checking payment:', {
          date: paymentDate,
          isRecent,
          amount: payment.total_payment
        });
        return isRecent;
      });

      if (!hasRecentPayment && extraPayment <= 0) {
        console.log('No recent payments or extra payment - streak is 0');
        setStreak(0);
      } else {
        // Calculate streak based on consecutive months
        let currentMonth = new Date();
        for (let i = 0; i < sortedPayments.length; i++) {
          const paymentDate = new Date(sortedPayments[i].payment_date);
          const expectedMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i);

          console.log('Checking streak month:', {
            paymentMonth: paymentDate.getMonth(),
            expectedMonth: expectedMonth.getMonth(),
            streak: currentStreak
          });

          if (paymentDate.getMonth() === expectedMonth.getMonth() &&
              paymentDate.getFullYear() === expectedMonth.getFullYear()) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Add current month to streak if there's an active extra payment
        if (extraPayment > 0) {
          currentStreak++;
          console.log('Added extra month to streak due to active extra payment');
        }

        setStreak(currentStreak);
      }

      // Calculate total savings
      const totalExtraPayments = sortedPayments.reduce((sum, payment) => sum + Number(payment.total_payment), 0);
      const totalOneTimeFunding = oneTimeFunding?.reduce((sum, funding) => sum + Number(funding.amount), 0) || 0;
      
      console.log('Calculated total savings:', {
        extraPayments: totalExtraPayments,
        oneTimeFunding: totalOneTimeFunding
      });
      
      setTotalSaved(totalExtraPayments + totalOneTimeFunding);
    };

    calculateMetrics();
  }, [paymentHistory, oneTimeFunding, extraPayment]);

  const getStreakMessage = () => {
    if (streak === 0) {
      return "Start your journey by making extra payments!";
    } else if (streak === 1) {
      return "Great start! Keep the momentum going!";
    } else if (streak < 3) {
      return "You're building consistency! Keep it up!";
    } else if (streak < 6) {
      return "Impressive streak! You're making great progress!";
    } else {
      return "Amazing dedication! You're a debt-busting champion!";
    }
  };

  const getStreakLevel = () => {
    if (streak >= 6) return "text-green-500";
    if (streak >= 3) return "text-blue-500";
    return "text-primary";
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/50 p-4 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Flame className={`h-5 w-5 ${getStreakLevel()}`} />
          <span className={`font-semibold ${getStreakLevel()}`}>
            {streak === 0 ? "Start Your Streak!" : `${streak} Month Streak!`}
          </span>
        </div>
        <Progress value={(streak / 12) * 100} className="h-2 mb-2" />
        <p className="text-sm text-gray-600">
          {getStreakMessage()}
        </p>
      </div>

      {totalSaved > 0 && (
        <div className="bg-white/50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">
              Total Savings: {formatCurrency(totalSaved)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Keep up the great work! Your dedication is paying off.
          </p>
        </div>
      )}
    </div>
  );
};