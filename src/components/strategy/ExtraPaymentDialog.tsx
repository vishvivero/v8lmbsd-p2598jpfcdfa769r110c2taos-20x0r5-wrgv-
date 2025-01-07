import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DebtChart } from "@/components/DebtChart";
import { useDebts } from "@/hooks/use-debts";

interface ExtraPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayment: number;
  onSave: (amount: number) => void;
  currencySymbol: string;
  totalDebtValue: number;
}

export const ExtraPaymentDialog = ({
  isOpen,
  onClose,
  currentPayment,
  onSave,
  currencySymbol,
  totalDebtValue
}: ExtraPaymentDialogProps) => {
  const [extraPayment, setExtraPayment] = useState(0);
  const { debts } = useDebts();
  const totalMinPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;

  const handleSave = () => {
    onSave(extraPayment);
    setExtraPayment(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-semibold">Set Extra Payment</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add an extra payment to your monthly payment plan.
        </p>
        <input
          type="number"
          value={extraPayment}
          onChange={(e) => setExtraPayment(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter extra payment amount"
        />
        <div className="mt-4 flex justify-between items-center">
          <span className="font-medium">Total Payment:</span>
          <span className="font-medium">
            {currencySymbol}{(currentPayment + extraPayment).toLocaleString()}
          </span>
        </div>
        {debts && debts.length > 0 && (
          <div className="mt-6">
            <DebtChart
              debts={debts}
              monthlyPayment={currentPayment + extraPayment}
              currencySymbol={currencySymbol}
              totalMinPayments={totalMinPayments}
            />
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
