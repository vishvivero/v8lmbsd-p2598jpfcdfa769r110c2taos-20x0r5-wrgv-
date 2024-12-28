import { Table, TableBody } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import { DebtTableHeader } from "./debt-table/DebtTableHeader";
import { DebtTableRow } from "./debt-table/DebtTableRow";
import { DebtTableFooter } from "./debt-table/DebtTableFooter";
import { calculatePayoffDetails } from "@/lib/utils/debtCalculations";

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
  const [showDecimals, setShowDecimals] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);

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

  const handleDeleteConfirm = () => {
    if (debtToDelete) {
      onDeleteDebt(debtToDelete.id);
      setDebtToDelete(null);
    }
  };

  const calculatePayoffDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const payoffDetails = calculatePayoffDetails(debts, monthlyPayment);

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
          <DebtTableHeader />
          <TableBody>
            {debts.map((debt, index) => (
              <DebtTableRow
                key={debt.id}
                debt={debt}
                index={index}
                payoffDetails={payoffDetails}
                formatMoneyValue={formatMoneyValue}
                formatInterestRate={formatInterestRate}
                calculatePayoffDate={calculatePayoffDate}
                onUpdateDebt={onUpdateDebt}
                onDeleteClick={setDebtToDelete}
              />
            ))}
            <DebtTableFooter
              debts={debts}
              monthlyPayment={monthlyPayment}
              payoffDetails={payoffDetails}
              formatMoneyValue={formatMoneyValue}
            />
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
                    <li><strong>Balance:</strong> {formatMoneyValue(debtToDelete.balance)}</li>
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