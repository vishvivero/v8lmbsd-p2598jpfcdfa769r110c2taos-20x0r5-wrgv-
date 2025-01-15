import { Debt } from "@/lib/types/debt";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { EditDebtDialog } from "./EditDebtDialog";
import { useNavigate } from "react-router-dom";

interface DebtCardProps {
  debt: Debt;
  onDelete: (id: string) => void;
  calculatePayoffYears: (debt: Debt) => string;
}

export const DebtCard = ({
  debt,
  onDelete,
  calculatePayoffYears
}: DebtCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Calculate months to payoff and progress percentage
  const getPayoffDetails = (debt: Debt): { months: number; formattedTime: string; progressPercentage: number } => {
    const monthlyInterest = debt.interest_rate / 1200;
    const monthlyPayment = debt.minimum_payment;
    const balance = debt.balance;
    
    if (monthlyPayment <= balance * monthlyInterest) {
      return { months: Infinity, formattedTime: "Never", progressPercentage: 0 };
    }

    const months = Math.log(monthlyPayment / (monthlyPayment - balance * monthlyInterest)) / Math.log(1 + monthlyInterest);
    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);
    
    // Calculate progress percentage - if monthly payment can't cover interest, progress is 0%
    const monthlyInterestAmount = balance * monthlyInterest;
    const progressPercentage = monthlyPayment <= monthlyInterestAmount ? 0 : 
      Math.min((monthlyPayment - monthlyInterestAmount) / balance * 100, 100);
    
    let formattedTime = "";
    if (years === 0) {
      formattedTime = `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else {
      formattedTime = `${years} year${years !== 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }

    return { months, formattedTime, progressPercentage };
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/overview/debt/${debt.id}`);
  };

  const payoffDetails = getPayoffDetails(debt);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{debt.name}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(debt.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-gray-600 mb-1">Balance</p>
            <p className="text-2xl font-semibold">
              {debt.currency_symbol}{debt.balance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Monthly Payment</p>
            <p className="text-2xl font-semibold">
              {debt.currency_symbol}{debt.minimum_payment.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">APR</p>
            <p className="text-2xl font-semibold">
              {debt.interest_rate}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Progress</h4>
            <span className="text-sm font-medium text-gray-600">
              {payoffDetails.progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={payoffDetails.progressPercentage} className="h-2" />
          <p className="text-sm text-gray-600 text-center">
            Estimated payoff in {payoffDetails.formattedTime}
          </p>
        </div>
      </motion.div>

      <EditDebtDialog 
        debt={debt}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};