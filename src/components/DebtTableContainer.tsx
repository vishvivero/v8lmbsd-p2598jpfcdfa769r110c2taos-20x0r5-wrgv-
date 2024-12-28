import { useState } from "react";
import { DebtTable } from "./DebtTable";
import { DecimalToggle } from "./DecimalToggle";
import { DeleteDebtDialog } from "./DeleteDebtDialog";
import { Debt } from "@/lib/types/debt";
import { strategies } from "@/lib/strategies";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";

interface DebtTableContainerProps {
  debts: Debt[];
  monthlyPayment?: number;
  onUpdateDebt: (updatedDebt: Debt) => void;
  onDeleteDebt: (debtId: string) => void;
  currencySymbol?: string;
  selectedStrategy?: string;
}

export const DebtTableContainer = ({
  debts,
  monthlyPayment = 0,
  onUpdateDebt,
  onDeleteDebt,
  currencySymbol = '$',
  selectedStrategy = 'avalanche'
}: DebtTableContainerProps) => {
  const [showDecimals, setShowDecimals] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);

  console.log('DebtTableContainer: Calculating payoff with strategy:', selectedStrategy);
  const strategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];
  
  // Sort debts according to the selected strategy
  const sortedDebts = strategy.calculate([...debts]);
  console.log('DebtTableContainer: Debts sorted according to strategy:', strategy.name);
  
  const payoffDetails = calculatePayoffDetails(sortedDebts, monthlyPayment, strategy);
  console.log('DebtTableContainer: Payoff details calculated:', payoffDetails);

  return (
    <div className="space-y-4">
      <DecimalToggle showDecimals={showDecimals} onToggle={setShowDecimals} />
      
      <div className="rounded-lg border bg-white/50 backdrop-blur-sm overflow-hidden">
        <DebtTable
          debts={sortedDebts}
          payoffDetails={payoffDetails}
          onUpdateDebt={onUpdateDebt}
          onDeleteClick={setDebtToDelete}
          showDecimals={showDecimals}
          currencySymbol={currencySymbol}
        />
      </div>

      <DeleteDebtDialog
        debt={debtToDelete}
        onClose={() => setDebtToDelete(null)}
        onConfirm={() => {
          if (debtToDelete) {
            onDeleteDebt(debtToDelete.id);
            setDebtToDelete(null);
          }
        }}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};