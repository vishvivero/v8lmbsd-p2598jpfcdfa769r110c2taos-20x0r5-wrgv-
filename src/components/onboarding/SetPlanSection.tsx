import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/strategies";

interface SetPlanSectionProps {
  totalMinimumPayments: number;
  currencySymbol: string;
  onPaymentChange: (amount: number) => void;
}

export const SetPlanSection = ({ 
  totalMinimumPayments, 
  currencySymbol,
  onPaymentChange 
}: SetPlanSectionProps) => {
  const [customPayment, setCustomPayment] = useState<number>(totalMinimumPayments);

  const handleCustomPaymentChange = (value: number) => {
    setCustomPayment(value);
    onPaymentChange(value);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-medium text-gray-900 text-left">
          Set Your Monthly Payment
        </h1>
        <p className="text-lg text-gray-600 text-left">
          Choose how much you want to pay towards your debts each month.
        </p>
      </motion.div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="monthly-payment" className="border rounded-lg p-4">
          <AccordionTrigger className="text-lg font-medium">
            Monthly Payments
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4">
              <p className="text-gray-600">How much are you paying to your debts now?</p>
              
              <div className="space-y-4">
                <div 
                  className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-colors"
                  onClick={() => onPaymentChange(totalMinimumPayments)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Minimum Payments</h4>
                      <p className="text-sm text-gray-500">The minimum amount required</p>
                    </div>
                    <span className="text-lg font-medium">
                      {formatCurrency(totalMinimumPayments, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm">
                  <h4 className="font-medium mb-2">Custom Amount</h4>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currencySymbol}
                    </span>
                    <Input
                      type="number"
                      min={totalMinimumPayments}
                      value={customPayment}
                      onChange={(e) => handleCustomPaymentChange(Number(e.target.value))}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};