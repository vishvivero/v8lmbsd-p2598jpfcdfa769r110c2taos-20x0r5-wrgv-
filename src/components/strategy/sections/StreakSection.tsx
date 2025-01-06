import { Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StreakSectionProps {
  streak: number;
}

export const StreakSection = ({ streak }: StreakSectionProps) => {
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
        {streak === 0 
          ? "Make your first extra payment to start building your streak!"
          : "Keep it up! You're building great habits."}
      </p>
    </div>
  );
};