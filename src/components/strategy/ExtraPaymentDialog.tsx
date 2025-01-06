import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DebtChart } from "@/components/DebtChart";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency } from "@/lib/paymentCalculator";
import { motion } from "framer-motion";
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

    const basePayoffMonths = Math.max(
      ...debts.map(debt => calculatePayoffTime(debt, debt.minimum_payment))
    );

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
          <DialogTitle className="text-lg font-semibold text-primary">Set Extra Monthly Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
              <h3 className="text-sm text-gray-500">Debt-free Date</h3>
              <p className="text-lg font-semibold text-primary">{stats.debtFreeDate}</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
              <h3 className="text-sm text-gray-500">Time Until Debt-free</h3>
              <p className="text-lg font-semibold text-gray-700">{stats.countdown}</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
              <h3 className="text-sm text-gray-500">Time Saved</h3>
              <p className="text-lg font-semibold text-primary">{stats.accelerated}</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
              <h3 className="text-sm text-gray-500">Interest Saved</h3>
              <p className="text-lg font-semibold text-primary">{stats.interestSaved}</p>
            </div>
          </div>

          <div className="h-[200px] bg-white/95 rounded-lg border border-gray-100 p-2">
            <DebtChart
              debts={debts}
              monthlyPayment={currentPayment + extraPayment}
              currencySymbol={currencySymbol}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Extra monthly payment</span>
              <span className="font-semibold text-primary">
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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Extra Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};