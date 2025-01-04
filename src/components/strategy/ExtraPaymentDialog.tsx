import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DebtChart } from "@/components/DebtChart";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency } from "@/lib/paymentCalculator";
import { motion } from "framer-motion";

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

  const stats = {
    debtFreeDate: "Apr 2030",
    countdown: "5 years 2 months",
    accelerated: "1 year 11 months",
    interestSaved: "£4,972.57",
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
              <h3 className="text-sm text-gray-500">Payoff accelerated</h3>
              <p className="text-xl font-semibold">{stats.accelerated}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Interest saved</h3>
              <p className="text-xl font-semibold">{stats.interestSaved}</p>
            </div>
          </div>

          <div className="h-[300px]">
            <DebtChart
              debts={debts}
              monthlyPayment={currentPayment}
              currencySymbol={currencySymbol}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Extra *</span>
              <span className="font-semibold">
                {currencySymbol} {extraPayment}
              </span>
            </div>
            <Slider
              value={[extraPayment]}
              onValueChange={(value) => setExtraPayment(value[0])}
              max={maxExtra}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};