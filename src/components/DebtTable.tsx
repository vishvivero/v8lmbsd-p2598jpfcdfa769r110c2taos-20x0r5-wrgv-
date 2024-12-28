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
import { DebtTableHeader } from "./DebtTableHeader";
import { DebtTableRow } from "./DebtTableRow";
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

  const handleDeleteConfirm = () => {
    if (debtToDelete) {
      onDeleteDebt(debtToDelete.id);
      setDebtToDelete(null);
    }
  };

  const payoffDetails = calculatePayoffDetails(debts, monthlyPayment);

  const totals = debts.reduce(
    (acc, debt) => {
      const details = payoffDetails[debt.id];
      return {
        balance: acc.balance + debt.balance,
        minimumPayment: acc.minimumPayment + debt.minimum_payment,
        totalInterest: acc.totalInterest + details.totalInterest,
      };
    },
    { balance: 0, minimumPayment: 0, totalInterest: 0 }
  );

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
                payoffDetails={payoffDetails[debt.id]}
                onUpdateDebt={onUpdateDebt}
                onDeleteClick={setDebtToDelete}
                showDecimals={showDecimals}
                currencySymbol={currencySymbol}
              />
            ))}
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
                    <li><strong>Balance:</strong> {currencySymbol}{debtToDelete.balance}</li>
                    <li><strong>Interest Rate:</strong> {debtToDelete.interest_rate}%</li>
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