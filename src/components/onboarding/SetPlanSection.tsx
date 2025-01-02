import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency } from "@/lib/strategies";

interface SetPlanSectionProps {
  totalMinimumPayments: number;
  onMonthlyPaymentSet: (amount: number) => void;
  currencySymbol: string;
}

export const SetPlanSection = ({
  totalMinimumPayments,
  onMonthlyPaymentSet,
  currencySymbol,
}: SetPlanSectionProps) => {
  const [paymentType, setPaymentType] = useState<"minimum" | "custom">("minimum");
  const [customAmount, setCustomAmount] = useState<string>("");

  const handlePaymentTypeChange = (value: "minimum" | "custom") => {
    setPaymentType(value);
    if (value === "minimum") {
      onMonthlyPaymentSet(totalMinimumPayments);
    }
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numericValue = parseFloat(value) || 0;
    if (numericValue >= totalMinimumPayments) {
      onMonthlyPaymentSet(numericValue);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 p-6">
      {/* Left side text */}
      <div className="col-span-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
        <div className="h-full flex items-center justify-center p-6">
          <p className="text-lg text-gray-900 text-center">
            Your total minimum payments to all your debts is{" "}
            <span className="font-semibold">
              {formatCurrency(totalMinimumPayments, currencySymbol)}
            </span>
          </p>
        </div>
      </div>

      {/* Right side content */}
      <div className="col-span-9 space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="monthly-payment" className="border rounded-lg p-4">
            <AccordionTrigger className="text-lg font-semibold">
              Monthly Payments
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-6">
                <Label className="text-base">
                  How much are you paying to your debts now?
                </Label>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(value: "minimum" | "custom") =>
                    handlePaymentTypeChange(value)
                  }
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimum" id="minimum" />
                    <Label htmlFor="minimum" className="font-normal">
                      Minimum Payments ({formatCurrency(totalMinimumPayments, currencySymbol)})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-normal">
                      Custom Amount
                    </Label>
                  </div>
                </RadioGroup>

                {paymentType === "custom" && (
                  <div className="pl-6">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {currencySymbol}
                      </span>
                      <Input
                        type="number"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="pl-7"
                        min={totalMinimumPayments}
                        placeholder={`Enter amount (min: ${formatCurrency(
                          totalMinimumPayments,
                          currencySymbol
                        )})`}
                      />
                    </div>
                    {parseFloat(customAmount) < totalMinimumPayments && (
                      <p className="text-destructive text-sm mt-2">
                        Amount must be at least {formatCurrency(totalMinimumPayments, currencySymbol)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};