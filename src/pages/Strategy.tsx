import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/strategies";
import { ArrowUpDown, Info, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { motion } from "framer-motion";
import { StrategySelector } from "@/components/StrategySelector";
import { PaymentOverview } from "@/components/strategy/PaymentOverview";

export default function Strategy() {
  const { debts } = useDebts();
  const { profile, updateProfile } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0]
  );
  const { toast } = useToast();

  const handleStrategyChange = async (strategy: typeof strategies[0]) => {
    if (!profile) return;

    setSelectedStrategy(strategy);
    console.log('Updating strategy to:', strategy.id);

    try {
      await updateProfile.mutateAsync({
        ...profile,
        selected_strategy: strategy.id
      });
      
      toast({
        title: "Success",
        description: "Payment strategy updated successfully",
      });
    } catch (error) {
      console.error('Error updating strategy:', error);
      toast({
        title: "Error",
        description: "Failed to update payment strategy",
        variant: "destructive",
      });
    }
  };

  const handleSaveExtra = async (amount: number) => {
    if (!profile) return;
    
    try {
      await updateProfile.mutateAsync({
        ...profile,
        monthly_payment: amount
      });
      
      toast({
        title: "Success",
        description: "Monthly payment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update monthly payment",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-7xl py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Payment Strategy
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Tutorial
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">Optimize your debt payoff plan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <PaymentOverview
                debts={debts || []}
                monthlyPayment={profile?.monthly_payment || 0}
                selectedStrategy={selectedStrategy.id}
                currencySymbol={profile?.preferred_currency || '£'}
                onExtraPaymentClick={() => setIsDialogOpen(true)}
                onSaveExtra={handleSaveExtra}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Strategy Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StrategySelector
                    strategies={strategies}
                    selectedStrategy={selectedStrategy}
                    onSelectStrategy={handleStrategyChange}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-primary" />
                  Payment Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>FREQUENCY</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Once per month on the 1st</SelectItem>
                        <SelectItem value="biweekly">Every two weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <ExtraPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPayment={profile?.monthly_payment || 0}
        onSave={handleSaveExtra}
        currencySymbol={profile?.preferred_currency || "£"}
      />
    </MainLayout>
  );
}