import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DebtChart } from "@/components/DebtChart";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency } from "@/lib/calculations";
import { calculatePayoffTime } from "@/lib/strategies";

interface ExtraPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayment: number;
  onSave: (amount: number) => void;
  currencySymbol: string;
}

export const ExtraPaymentDialog = ({
  isOpen,
  onClose,
  currentPayment,
  onSave,
  currencySymbol,
}: ExtraPaymentDialogProps) => {
  const { debts } = useDebts();
  const [extraPayment, setExtraPayment] = useState(0);
  const maxExtra = 1000; // Maximum extra payment allowed

  useEffect(() => {
    if (!isOpen) {
      setExtraPayment(0);
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(extraPayment);
    onClose();
  };

  const calculateStats = () => {
    if (!debts || debts.length === 0) return null;

    // Calculate payoff time without extra payments
    const basePayoffMonths = Math.max(
      ...debts.map(debt => calculatePayoffTime(debt, debt.minimum_payment))
    );

    // Calculate payoff time with extra payments
    const extraPayoffMonths = Math.max(
      ...debts.map(debt => {
        const totalPayment = debt.minimum_payment + (extraPayment / debts.length);
        return calculatePayoffTime(debt, totalPayment);
      })
    );

    const baseDate = new Date();
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + extraPayoffMonths);

    const monthsDifference = extraPayoffMonths - basePayoffMonths;
    const yearsSaved = Math.floor(Math.abs(monthsDifference) / 12);
    const monthsSaved = Math.abs(monthsDifference) % 12;

    // Calculate total interest saved (simplified calculation)
    const totalInterestSaved = debts.reduce((acc, debt) => {
      const monthlyInterest = (debt.interest_rate / 100 / 12) * debt.balance;
      return acc + (monthlyInterest * monthsDifference);
    }, 0);

    return {
      debtFreeDate: payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      countdown: `${extraPayoffMonths} months`,
      accelerated: `${yearsSaved > 0 ? `${yearsSaved} years ` : ''}${monthsSaved} months`,
      interestSaved: formatCurrency(totalInterestSaved, currencySymbol),
    };
  };

  const stats = calculateStats() || {
    debtFreeDate: "-",
    countdown: "-",
    accelerated: "-",
    interestSaved: "-"
  };

  if (!debts) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recurring funding for extra payments</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-500">Debt-free Date</h3>
              <p className="text-xl font-semibold text-blue-500">{stats.debtFreeDate}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Debt-free Countdown</h3>
              <p className="text-xl font-semibold">{stats.countdown}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Time Saved</h3>
              <p className="text-xl font-semibold text-green-500">{stats.accelerated}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Interest saved</h3>
              <p className="text-xl font-semibold text-green-500">{stats.interestSaved}</p>
            </div>
          </div>

          <div className="h-[300px]">
            <DebtChart
              debts={debts}
              monthlyPayment={currentPayment + extraPayment}
              currencySymbol={currencySymbol}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Extra monthly payment</span>
              <span className="font-semibold">
                {currencySymbol}{extraPayment}
              </span>
            </div>
            <Slider
              value={[extraPayment]}
              onValueChange={(value) => setExtraPayment(value[0])}
              max={maxExtra}
              step={10}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Adjust the slider to see how extra payments affect your debt payoff timeline
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Extra Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
