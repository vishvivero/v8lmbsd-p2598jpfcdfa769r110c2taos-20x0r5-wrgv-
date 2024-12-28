import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Debt, formatCurrency, calculatePayoffTime } from "@/lib/strategies";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditDebtForm } from "./EditDebtForm";

interface DebtTableProps {
  debts: Debt[];
  monthlyPayment?: number;
  onUpdateDebt: (updatedDebt: Debt) => void;
}

export const DebtTable = ({ debts, monthlyPayment = 0, onUpdateDebt }: DebtTableProps) => {
  const calculateTotalInterest = (debt: Debt, months: number) => {
    const totalPaid = debt.minimumPayment * months;
    return totalPaid - debt.balance;
  };

  const calculatePayoffDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const calculateProposedPayment = (debt: Debt, index: number) => {
    if (monthlyPayment <= 0) return debt.minimumPayment;

    // Calculate total minimum payments for all remaining debts
    const remainingDebtsMinPayments = debts
      .slice(index)
      .reduce((sum, d) => sum + d.minimumPayment, 0);

    // For the current focus debt (first in strategy order), allocate extra payment
    if (index === 0) {
      const extraPayment = monthlyPayment - remainingDebtsMinPayments;
      return debt.minimumPayment + extraPayment;
    }

    // Other debts receive their minimum payment
    return debt.minimumPayment;
  };

  const totals = debts.reduce(
    (acc, debt) => {
      const proposedPayment = calculateProposedPayment(debt, debts.indexOf(debt));
      const months = calculatePayoffTime(debt, proposedPayment);
      const totalInterest = calculateTotalInterest(debt, months);
      return {
        balance: acc.balance + debt.balance,
        minimumPayment: acc.minimumPayment + debt.minimumPayment,
        totalInterest: acc.totalInterest + totalInterest,
      };
    },
    { balance: 0, minimumPayment: 0, totalInterest: 0 }
  );

  return (
    <div className="rounded-lg border bg-white/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Banking Institution</TableHead>
            <TableHead>Debt Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Minimum Payment</TableHead>
            <TableHead>Proposed Payment</TableHead>
            <TableHead>Total Interest Paid</TableHead>
            <TableHead>Months to Payoff</TableHead>
            <TableHead>Payoff Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt, index) => {
            const proposedPayment = calculateProposedPayment(debt, index);
            const months = calculatePayoffTime(debt, proposedPayment);
            const totalInterest = calculateTotalInterest(debt, months);
            
            return (
              <motion.tr
                key={debt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-muted/50"
              >
                <TableCell>{debt.bankerName}</TableCell>
                <TableCell className="font-medium">{debt.name}</TableCell>
                <TableCell className="number-font">{formatCurrency(debt.balance)}</TableCell>
                <TableCell className="number-font">{debt.interestRate}%</TableCell>
                <TableCell className="number-font">{formatCurrency(debt.minimumPayment)}</TableCell>
                <TableCell className="number-font">{formatCurrency(proposedPayment)}</TableCell>
                <TableCell className="number-font">{formatCurrency(totalInterest)}</TableCell>
                <TableCell className="number-font">{months} months</TableCell>
                <TableCell className="number-font">{calculatePayoffDate(months)}</TableCell>
                <TableCell>
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
                </TableCell>
              </motion.tr>
            );
          })}
          <TableRow className="font-bold bg-muted/20">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="number-font">{formatCurrency(totals.balance)}</TableCell>
            <TableCell>-</TableCell>
            <TableCell className="number-font">{formatCurrency(totals.minimumPayment)}</TableCell>
            <TableCell className="number-font">{formatCurrency(monthlyPayment)}</TableCell>
            <TableCell className="number-font">{formatCurrency(totals.totalInterest)}</TableCell>
            <TableCell colSpan={3}>-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
