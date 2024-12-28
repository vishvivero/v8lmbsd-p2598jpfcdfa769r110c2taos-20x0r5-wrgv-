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
import { Debt } from "@/lib/types/debt";

interface DeleteDebtDialogProps {
  debt: Debt | null;
  onClose: () => void;
  onConfirm: () => void;
  currencySymbol: string;
}

export const DeleteDebtDialog = ({
  debt,
  onClose,
  onConfirm,
  currencySymbol
}: DeleteDebtDialogProps) => {
  if (!debt) return null;

  return (
    <AlertDialog open={!!debt} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this debt?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>You are about to delete the following debt:</p>
            <ul className="list-disc pl-4">
              <li><strong>Debt Name:</strong> {debt.name}</li>
              <li><strong>Bank:</strong> {debt.banker_name}</li>
              <li><strong>Balance:</strong> {currencySymbol}{debt.balance}</li>
              <li><strong>Interest Rate:</strong> {debt.interest_rate}%</li>
            </ul>
            <p className="text-destructive">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Delete Debt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};