import { Card } from "@/components/ui/card";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency } from "@/lib/strategies";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { useState } from "react";

export const OverviewPayment = () => {
  const { debts, profile } = useDebts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Payment Overview</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Total minimum payments for your debts
        </p>
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Minimum Payments</span>
          <span className="font-medium">
            {formatCurrency(totalMinimumPayments, profile?.preferred_currency)}
          </span>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Set Extra Payment
        </button>
      </Card>

      <ExtraPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPayment={totalMinimumPayments}
        onSave={(amount) => {
          console.log("Extra payment saved:", amount);
          setIsDialogOpen(false);
        }}
        currencySymbol={profile?.preferred_currency || "£"}
      />
    </div>
  );
};
