import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddDebtForm } from "@/components/AddDebtForm";
import { Debt } from "@/lib/types/debt";

interface AddDebtDialogProps {
  onAddDebt: (debt: Omit<Debt, "id">) => void;
  currencySymbol: string;
}

export const AddDebtDialog = ({ onAddDebt, currencySymbol }: AddDebtDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add debt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Add New Debt</DialogTitle>
        </DialogHeader>
        <AddDebtForm onAddDebt={onAddDebt} currencySymbol={currencySymbol} />
      </DialogContent>
    </Dialog>
  );
};