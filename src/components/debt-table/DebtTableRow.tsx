import { TableCell } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditDebtForm } from "../EditDebtForm";

interface DebtTableRowProps {
  debt: Debt;
  index: number;
  payoffDetails: any;
  formatMoneyValue: (value: number) => string;
  formatInterestRate: (value: number) => string;
  calculatePayoffDate: (months: number) => string;
  onUpdateDebt: (debt: Debt) => void;
  onDeleteClick: (debt: Debt) => void;
}

export const DebtTableRow = ({
  debt,
  index,
  payoffDetails,
  formatMoneyValue,
  formatInterestRate,
  calculatePayoffDate,
  onUpdateDebt,
  onDeleteClick,
}: DebtTableRowProps) => {
  const details = payoffDetails[debt.id] || {
    months: 0,
    totalInterest: 0,
    proposedPayment: debt.minimum_payment
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="hover:bg-muted/50"
    >
      <TableCell>{debt.banker_name}</TableCell>
      <TableCell className="font-medium">{debt.name}</TableCell>
      <TableCell className="number-font">{formatMoneyValue(debt.balance)}</TableCell>
      <TableCell className="number-font">{formatInterestRate(debt.interest_rate)}</TableCell>
      <TableCell className="number-font">{formatMoneyValue(debt.minimum_payment)}</TableCell>
      <TableCell className="number-font">{formatMoneyValue(details.proposedPayment)}</TableCell>
      <TableCell className="number-font">{formatMoneyValue(details.totalInterest)}</TableCell>
      <TableCell className="number-font">{details.months} months</TableCell>
      <TableCell className="number-font">{calculatePayoffDate(details.months)}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Debt</DialogTitle>
              </DialogHeader>
              <EditDebtForm debt={debt} onSubmit={onUpdateDebt} />
            </DialogContent>
          </Dialog>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDeleteClick(debt)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  );
};