import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditDebtForm } from "@/components/EditDebtForm";
import { Debt } from "@/lib/types/debt";

interface EditDebtDialogProps {
  debt: Debt;
  isOpen: boolean;
  onClose: () => void;
}

export const EditDebtDialog = ({ debt, isOpen, onClose }: EditDebtDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Debt: {debt.name}</DialogTitle>
        </DialogHeader>
        <EditDebtForm debt={debt} onSubmit={onClose} />
      </DialogContent>
    </Dialog>
  );
};