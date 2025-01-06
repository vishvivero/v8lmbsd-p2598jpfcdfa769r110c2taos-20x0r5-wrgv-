import { Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface StreakSectionProps {
  extraPayment: number;
}

export const StreakSection = ({ extraPayment }: StreakSectionProps) => {
  const [streak, setStreak] = useState(0);
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
        .limit(12); // Last 12 months

      if (error) {
        console.error("Error fetching payment history:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate streak based on payment history
  useEffect(() => {
    const calculateStreak = () => {
      if (!paymentHistory?.length) {
        setStreak(0);
        return;
      }

      let currentStreak = 0;
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      // Sort payments by date descending
      const sortedPayments = [...paymentHistory].sort((a, b) => 
        new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
      );

      // Check if there's a payment in the last month
      const hasRecentPayment = sortedPayments.some(payment => 
        new Date(payment.payment_date) >= lastMonth
      );

      if (!hasRecentPayment) {
        setStreak(0);
        return;
      }

      // Calculate consecutive months with payments
      for (let i = 0; i < sortedPayments.length; i++) {
        const paymentDate = new Date(sortedPayments[i].payment_date);
        const expectedMonth = new Date(now.getFullYear(), now.getMonth() - i);

        if (paymentDate.getMonth() === expectedMonth.getMonth() &&
            paymentDate.getFullYear() === expectedMonth.getFullYear()) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    };

    calculateStreak();
  }, [paymentHistory]);

  const getStreakMessage = () => {
    if (streak === 0 && extraPayment === 0) {
      return "Make your first extra payment to start building your streak!";
    } else if (streak === 0) {
      return "Start your streak by maintaining your extra payments!";
    } else if (streak === 1) {
      return "Great start! Keep going for a longer streak!";
    } else if (streak < 3) {
      return "You're building momentum! Keep it up!";
    } else if (streak < 6) {
      return "Impressive streak! You're making great progress!";
    } else {
      return "Amazing dedication! You're a debt-busting champion!";
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Award className="h-5 w-5 text-blue-500" />
        <span className="font-semibold text-blue-700">
          {streak === 0 ? "Start Your Streak!" : `${streak} Month Streak!`}
        </span>
      </div>
      <Progress value={(streak / 12) * 100} className="h-2" />
      <p className="text-sm text-blue-600 mt-2">
        {getStreakMessage()}
      </p>
    </div>
  );
};