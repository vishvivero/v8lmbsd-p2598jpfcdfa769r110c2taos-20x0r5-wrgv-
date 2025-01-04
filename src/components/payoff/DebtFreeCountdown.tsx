import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";

interface DebtFreeCountdownProps {
  projectedDate: Date | undefined;
  years: number;
  months: number;
}

export const DebtFreeCountdown = ({
  projectedDate,
  years,
  months
}: DebtFreeCountdownProps) => {
  return (
    <Card className="h-full bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#107A57]">DEBT-FREE COUNTDOWN</CardTitle>
          <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#34D399]" />
          </div>
        </div>
        {projectedDate && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Projected debt-free date</p>
            <p className="text-lg font-semibold text-[#111827]">
              {projectedDate.toLocaleDateString('en-US', { 
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="text-center p-3 bg-[#E5E7EB] rounded-lg flex-1">
                <div className="text-2xl font-bold text-[#111827]">{years}</div>
                <div className="text-sm text-gray-600">years</div>
              </div>
              <div className="text-center p-3 bg-[#E5E7EB] rounded-lg flex-1">
                <div className="text-2xl font-bold text-[#111827]">{months}</div>
                <div className="text-sm text-gray-600">months</div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 p-4 bg-[#E5E7EB] rounded-lg">
          <div className="p-2 bg-[#34D399]/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-[#34D399]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-[#107A57]">Your journey to financial freedom</h3>
            <p className="text-sm text-gray-600">Stay focused on your debt-free goal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};