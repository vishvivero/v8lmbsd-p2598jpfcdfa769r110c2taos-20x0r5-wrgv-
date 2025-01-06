import { Award, Flame, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/strategies";
import type { StreakMetrics } from "@/lib/utils/payment/streakCalculator";

interface StreakMetricsProps {
  metrics: StreakMetrics;
  currencySymbol?: string;
}

export const StreakMetricsDisplay = ({ metrics, currencySymbol = "£" }: StreakMetricsProps) => {
  const getStreakMessage = () => {
    if (metrics.streak === 0) {
      return "Start your journey by making extra payments!";
    } else if (metrics.streak === 1) {
      return "Great start! Keep the momentum going!";
    } else if (metrics.streak < 3) {
      return "You're building consistency! Keep it up!";
    } else if (metrics.streak < 6) {
      return "Impressive streak! You're making great progress!";
    } else {
      return "Amazing dedication! You're a debt-busting champion!";
    }
  };

  const getStreakLevel = () => {
    if (metrics.streak >= 6) return "text-green-500";
    if (metrics.streak >= 3) return "text-blue-500";
    return "text-primary";
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/50 p-4 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Flame className={`h-5 w-5 ${getStreakLevel()}`} />
          <span className={`font-semibold ${getStreakLevel()}`}>
            {metrics.streak === 0 ? "Start Your Streak!" : `${metrics.streak} Month Streak!`}
          </span>
        </div>
        <Progress value={(metrics.streak / 12) * 100} className="h-2 mb-2" />
        <p className="text-sm text-gray-600">
          {getStreakMessage()}
        </p>
      </div>

      {metrics.totalSaved > 0 && (
        <div className="bg-white/50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">
              Total Savings: {formatCurrency(metrics.totalSaved, currencySymbol)}
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