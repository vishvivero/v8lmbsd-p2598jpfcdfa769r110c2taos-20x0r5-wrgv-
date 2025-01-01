import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { Plus } from "lucide-react";

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
  const [showAddDebtForm, setShowAddDebtForm] = useState(true);

  const handleAddDebt = async (debt: Omit<Debt, "id">) => {
    try {
      const result = await addDebt.mutateAsync(debt);
      setDebts([...debts, result as Debt]);
      setShowAddDebtForm(false); // Hide form after successful addition
      toast({
        title: "Success",
        description: "Debt added successfully",
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

  const handleAddAnotherDebt = () => {
    setShowAddDebtForm(true);
  };

  const canProceed = strategy && debts.length > 0;

  const handleNext = () => {
    if (canProceed) {
      navigate("/onboarding/plan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Get Started with Your Debt-Free Journey</DialogTitle>
        <div className="p-6">
          <OnboardingProgress currentStep={1} />
        </div>
        
        <div className="grid grid-cols-12 gap-8 p-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-[calc(100vh-16rem)] flex items-center justify-center"
          >
            <h2 className="text-2xl font-medium text-gray-900 text-center leading-tight px-6">
              You are one step away from setting a plan
            </h2>
          </motion.div>

          <div className="col-span-9 space-y-6">
            <WelcomeSection />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="strategy" className="border rounded-lg p-4 mb-4">
                <AccordionTrigger className="text-lg font-medium">
                  Payment Strategy
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">What is most important to you at this moment?</p>
                    <StrategySelector 
                      value={strategy} 
                      onChange={setStrategy} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="debt-details" className="border rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium">
                  Debt Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {showAddDebtForm && (
                      <AddDebtForm 
                        onAddDebt={handleAddDebt}
                        currencySymbol={profile?.preferred_currency || "£"}
                      />
                    )}

                    {debts.length > 0 && (
                      <div className="mt-6 border rounded-lg p-4 bg-white/50 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Debts Added</h3>
                          {!showAddDebtForm && (
                            <Button
                              onClick={handleAddAnotherDebt}
                              variant="outline"
                              className="gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Another Debt
                            </Button>
                          )}
                        </div>
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
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="sticky bottom-0 w-full p-4 bg-white border-t">
          <div className="flex justify-end">
            <Button 
              size="lg"
              onClick={handleNext}
              disabled={!canProceed}
              className={`${canProceed ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300'}`}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};