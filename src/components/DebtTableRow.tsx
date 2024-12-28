import { TableCell, TableRow } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditDebtForm } from "./EditDebtForm";
import { motion } from "framer-motion";

interface DebtTableRowProps {
  debt: Debt;
  index: number;
  payoffDetails: {
    months: number;
    totalInterest: number;
    payoffDate: Date;
  };
  onUpdateDebt: (updatedDebt: Debt) => void;
  onDeleteClick: (debt: Debt) => void;
  showDecimals: boolean;
  currencySymbol: string;
}

export const DebtTableRow = ({
  debt,
  index,
  payoffDetails,
  onUpdateDebt,
  onDeleteClick,
  showDecimals,
  currencySymbol
}: DebtTableRowProps) => {
  const formatMoneyValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(value).replace('$', currencySymbol);
  };

  const formatInterestRate = (value: number) => {
    return value.toFixed(2) + '%';
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="hover:bg-muted/50"
    >
      <TableCell className="text-center">{debt.banker_name}</TableCell>
      <TableCell className="text-center font-medium">{debt.name}</TableCell>
      <TableCell className="text-center number-font">{formatMoneyValue(debt.balance)}</TableCell>
      <TableCell className="text-center number-font">{formatInterestRate(debt.interest_rate)}</TableCell>
      <TableCell className="text-center number-font">{formatMoneyValue(debt.minimum_payment)}</TableCell>
      <TableCell className="text-center number-font">{formatMoneyValue(payoffDetails.totalInterest)}</TableCell>
      <TableCell className="text-center number-font">{payoffDetails.months} months</TableCell>
      <TableCell className="text-center number-font">
        {payoffDetails.payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </TableCell>
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