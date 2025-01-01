import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import { WelcomeSection } from "./WelcomeSection";
import { StrategySelector } from "./StrategySelector";
import { AddDebtForm } from "@/components/AddDebtForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebts } from "@/hooks/use-debts";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types/debt";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const [strategy, setStrategy] = useState("");
  const [debts, setDebts] = useState<Debt[]>([]);
  const { addDebt, profile } = useDebts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddDebt = async (debt: any) => {
    try {
      await addDebt.mutateAsync(debt);
      setDebts([...debts, debt]);
      toast({
        title: "Debt added successfully",
        description: "Your debt has been added to your profile.",
      });
    } catch (error) {
      console.error("Error adding debt:", error);
      toast({
        title: "Error",
        description: "Failed to add debt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotals = () => {
    return debts.reduce(
      (acc, debt) => ({
        balance: acc.balance + debt.balance,
        minimumPayment: acc.minimumPayment + debt.minimum_payment,
      }),
      { balance: 0, minimumPayment: 0 }
    );
  };

  const canProceed = strategy && debts.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <OnboardingProgress currentStep={1} />
        </div>
        
        <div className="grid grid-cols-12 gap-8 p-6">
          {/* Left side text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"
          >
            <div className="h-full flex items-center justify-center p-6">
              <p className="text-lg text-gray-900 text-center">
                You are one step away from setting a plan
              </p>
            </div>
          </motion.div>

          {/* Right side content */}
          <div className="col-span-9 space-y-6">
            <WelcomeSection />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="strategy" className="border rounded-lg p-4 mb-4">
                <AccordionTrigger className="text-sm font-normal">
                  Payment Strategy
                </AccordionTrigger>
                <AccordionContent>
                  <StrategySelector 
                    value={strategy} 
                    onChange={setStrategy} 
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="debt-details" className="border rounded-lg p-4">
                <AccordionTrigger className="text-sm font-normal">
                  Debt Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <AddDebtForm 
                      onAddDebt={handleAddDebt}
                      currencySymbol={profile?.preferred_currency || "£"}
                    />

                    {debts.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-base font-medium">Debts Added</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Debt Name</TableHead>
                              <TableHead>Balance</TableHead>
                              <TableHead>Interest Rate</TableHead>
                              <TableHead>Minimum Payment</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {debts.map((debt, index) => (
                              <TableRow key={index}>
                                <TableCell>{debt.name}</TableCell>
                                <TableCell>{debt.currency_symbol}{debt.balance}</TableCell>
                                <TableCell>{debt.interest_rate}%</TableCell>
                                <TableCell>{debt.currency_symbol}{debt.minimum_payment}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-medium">
                              <TableCell>Total</TableCell>
                              <TableCell>{profile?.preferred_currency || "£"}{calculateTotals().balance}</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>{profile?.preferred_currency || "£"}{calculateTotals().minimumPayment}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end">
              {canProceed && (
                <Button 
                  size="lg"
                  onClick={() => navigate("/onboarding/plan")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};