import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatMoneyValue, formatInterestRate } from "@/lib/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditDebtForm } from "./EditDebtForm";
import { useState } from "react";
import { 
  calculatePayoffTimeWithCascading, 
  calculateTotalInterest,
  calculatePayoffDate 
} from "@/lib/utils/debtCalculations";

interface DebtTableProps {
  debts: Debt[];
  monthlyPayment?: number;
  onUpdateDebt: (updatedDebt: Debt) => void;
  onDeleteDebt: (debtId: string) => void;
  currencySymbol?: string;
}

export const DebtTable = ({ 
  debts, 
  monthlyPayment = 0, 
  onUpdateDebt, 
  onDeleteDebt,
  currencySymbol = '$' 
}: DebtTableProps) => {
  const [showDecimals, setShowDecimals] = useState(true);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);

  const handleDeleteConfirm = () => {
    if (debtToDelete) {
      onDeleteDebt(debtToDelete.id);
      setDebtToDelete(null);
    }
  };

  const payoffMonths = calculatePayoffTimeWithCascading(debts, monthlyPayment);

  console.log('Processing debts for table:', debts.map(debt => ({
    id: debt.id,
    name: debt.name,
    balance: Number(debt.balance),
    balance_type: typeof debt.balance,
    balance_string: debt.balance.toString()
  })));

  const totals = debts.reduce(
    (acc, debt) => {
      console.log('Processing debt for totals:', {
        debtName: debt.name,
        balance: Number(debt.balance),
        balance_type: typeof debt.balance,
        balance_string: debt.balance.toString(),
        minimumPayment: debt.minimum_payment
      });
      
      const totalInterest = calculateTotalInterest(debt, monthlyPayment);
      const newTotals = {
        balance: acc.balance + Number(debt.balance),
        minimumPayment: acc.minimumPayment + Number(debt.minimum_payment),
        totalInterest: acc.totalInterest + totalInterest,
      };
      
      console.log('Updated totals:', {
        ...newTotals,
        balance_string: newTotals.balance.toString()
      });
      return newTotals;
    },
    { balance: 0, minimumPayment: 0, totalInterest: 0 }
  );

  console.log('Final totals:', totals);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <Switch
          id="show-decimals"
          checked={showDecimals}
          onCheckedChange={setShowDecimals}
        />
        <Label htmlFor="show-decimals">Show decimals</Label>
      </div>
      
      <div className="rounded-lg border bg-white/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Banking Institution</TableHead>
              <TableHead className="text-center">Debt Name</TableHead>
              <TableHead className="text-center">Balance</TableHead>
              <TableHead className="text-center">Interest Rate</TableHead>
              <TableHead className="text-center">Minimum Payment</TableHead>
              <TableHead className="text-center">Total Interest Paid</TableHead>
              <TableHead className="text-center">Months to Payoff</TableHead>
              <TableHead className="text-center">Payoff Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debts.map((debt, index) => {
              console.log('Rendering debt row:', {
                debtName: debt.name,
                balance: debt.balance,
                formattedBalance: formatMoneyValue(debt.balance, currencySymbol, showDecimals)
              });
              
              const months = payoffMonths[debt.id] || 0;
              const totalInterest = calculateTotalInterest(debt, monthlyPayment);
              
              return (
                <motion.tr
                  key={debt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>{debt.banker_name}</TableCell>
                  <TableCell className="font-medium">{debt.name}</TableCell>
                  <TableCell className="number-font text-right">
                    {formatMoneyValue(Number(debt.balance), currencySymbol, showDecimals)}
                  </TableCell>
                  <TableCell className="number-font text-right">
                    {formatInterestRate(Number(debt.interest_rate))}
                  </TableCell>
                  <TableCell className="number-font text-right">
                    {formatMoneyValue(Number(debt.minimum_payment), currencySymbol, showDecimals)}
                  </TableCell>
                  <TableCell className="number-font text-right">
                    {formatMoneyValue(totalInterest, currencySymbol, showDecimals)}
                  </TableCell>
                  <TableCell className="number-font text-right">{months} months</TableCell>
                  <TableCell className="number-font">{calculatePayoffDate(months)}</TableCell>
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
                        onClick={() => setDebtToDelete(debt)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
            <TableRow className="font-bold bg-muted/20">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="number-font text-right">
                {formatMoneyValue(totals.balance, currencySymbol, showDecimals)}
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell className="number-font text-right">
                {formatMoneyValue(totals.minimumPayment, currencySymbol, showDecimals)}
              </TableCell>
              <TableCell className="number-font text-right">
                {formatMoneyValue(totals.totalInterest, currencySymbol, showDecimals)}
              </TableCell>
              <TableCell colSpan={3}>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!debtToDelete} onOpenChange={(open) => !open && setDebtToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this debt?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              {debtToDelete && (
                <>
                  <p>You are about to delete the following debt:</p>
                  <ul className="list-disc pl-4">
                    <li><strong>Debt Name:</strong> {debtToDelete.name}</li>
                    <li><strong>Bank:</strong> {debtToDelete.banker_name}</li>
                    <li><strong>Balance:</strong> {formatMoneyValue(debtToDelete.balance, currencySymbol, showDecimals)}</li>
                    <li><strong>Interest Rate:</strong> {formatInterestRate(debtToDelete.interest_rate)}</li>
                  </ul>
                  <p className="text-destructive">This action cannot be undone.</p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete Debt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};