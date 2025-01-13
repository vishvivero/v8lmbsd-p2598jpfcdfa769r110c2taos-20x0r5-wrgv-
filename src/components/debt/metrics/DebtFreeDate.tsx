import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { differenceInMonths } from "date-fns";

interface DebtFreeDateProps {
  payoffDate: Date;
}

export const DebtFreeDate = ({ payoffDate }: DebtFreeDateProps) => {
  const today = new Date();
  const monthsLeft = differenceInMonths(payoffDate, today);
  const yearsLeft = Math.floor(monthsLeft / 12);
  const remainingMonths = monthsLeft % 12;

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-blue-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {payoffDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You will be paying debts for {yearsLeft > 0 ? `${yearsLeft} years` : ''} 
            {remainingMonths > 0 ? ` ${remainingMonths} months` : ''}!
          </p>
        </div>
      </div>
    </div>
  );
};