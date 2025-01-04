import { Debt } from "@/lib/types/debt";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

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
  const navigate = useNavigate();

  // Calculate the total amount that would be paid over time
  const calculateTotalAmount = (debt: Debt) => {
    const monthlyInterest = debt.interest_rate / 1200;
    const monthlyPayment = debt.minimum_payment;
    const balance = debt.balance;
    
    if (monthlyPayment <= balance * monthlyInterest) {
      return balance; // If payment is too low, return current balance
    }

    const months = Math.log(monthlyPayment / (monthlyPayment - balance * monthlyInterest)) / Math.log(1 + monthlyInterest);
    const totalAmount = monthlyPayment * months;
    return totalAmount;
  };

  const totalAmount = calculateTotalAmount(debt);
  const remainingBalance = debt.balance;
  const paidAmount = Math.max(0, totalAmount - remainingBalance);
  const progress = (paidAmount / totalAmount) * 100;

  // Calculate time to payoff
  const getPayoffTime = (debt: Debt): string => {
    const monthlyInterest = debt.interest_rate / 1200;
    const monthlyPayment = debt.minimum_payment;
    const balance = debt.balance;
    
    // Check if payment is too low to cover interest
    if (monthlyPayment <= balance * monthlyInterest) {
      return "Never";
    }

    // Calculate months to pay off
    const months = Math.log(monthlyPayment / (monthlyPayment - balance * monthlyInterest)) / Math.log(1 + monthlyInterest);
    
    // Convert months to years and months
    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{debt.name}</h3>
          <p className="text-sm text-gray-600">{debt.banker_name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/overview/debt/${debt.id}`)}
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

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-lg font-semibold text-gray-900">
            {debt.currency_symbol}{debt.balance.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Interest Rate</p>
          <p className="text-lg font-semibold text-gray-900">
            {debt.interest_rate}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Monthly Payment</p>
          <p className="text-lg font-semibold text-gray-900">
            {debt.currency_symbol}{debt.minimum_payment.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Time to Payoff</p>
          <p className="text-lg font-semibold text-gray-900">
            {getPayoffTime(debt)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Paid: {debt.currency_symbol}{paidAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span>Balance: {debt.currency_symbol}{remainingBalance.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-right text-sm text-gray-600">
          {progress.toFixed(1)}% Complete
        </div>
      </div>
    </motion.div>
  );
};