import { Debt } from "@/lib/types/debt";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface DebtCardProps {
  debt: Debt;
  onDelete: (id: string) => void;
  calculatePayoffYears: (debt: Debt) => string;
}

export const DebtCard = ({ debt, onDelete, calculatePayoffYears }: DebtCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        debt.balance > 10000 ? 'border-red-200 bg-red-50' :
        debt.balance > 5000 ? 'border-yellow-200 bg-yellow-50' :
        'border-green-200 bg-green-50'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{debt.name}</h3>
          <div className="flex gap-6 text-sm text-gray-600 mt-1">
            <span>Minimum: {debt.currency_symbol}{debt.minimum_payment}</span>
            <span>APR: {debt.interest_rate}%</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/planner/debt/${debt.id}`)}
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

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Balance: {debt.currency_symbol}{debt.balance}</span>
          <span>Paid off in {calculatePayoffYears(debt)}</span>
        </div>
        <Progress value={0} className="h-2" />
      </div>
    </motion.div>
  );
};