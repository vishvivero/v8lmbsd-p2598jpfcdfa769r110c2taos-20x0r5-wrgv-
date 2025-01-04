import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency, strategies } from "@/lib/strategies";
import { ArrowRight, Info, Wallet, ArrowUpDown, Target, PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { motion } from "framer-motion";
import { StrategySelector } from "@/components/StrategySelector";

export default function Strategy() {
  const { debts } = useDebts();
  const { profile, updateProfile } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const { toast } = useToast();
  
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const extraPayment = profile?.monthly_payment 
    ? Math.max(0, profile.monthly_payment - totalMinimumPayments)
    : 0;

  const handleSaveExtra = async (amount: number) => {
    if (!profile) return;
    
    const totalPayment = totalMinimumPayments + amount;
    try {
      await updateProfile.mutateAsync({
        ...profile,
        monthly_payment: totalPayment
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
              className="lg:col-span-2 space-y-6"
            >
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Payment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Minimum Payments</span>
                      <span className="font-medium">
                        {formatCurrency(totalMinimumPayments, profile?.preferred_currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Extra Payment</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={extraPayment}
                          onChange={(e) => handleSaveExtra(Number(e.target.value))}
                          className="w-32 text-right"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-medium">Total Monthly Payment</span>
                        <span className="font-medium text-primary">
                          {formatCurrency(totalMinimumPayments + extraPayment, profile?.preferred_currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New One-time Funding Section */}
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-primary" />
                    One-time Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bonus amounts for making payments
                  </p>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "One-time funding feature will be available soon!",
                      });
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add One-time Funding
                  </Button>
                </CardContent>
              </Card>
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
                    onSelectStrategy={setSelectedStrategy}
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
        currentPayment={totalMinimumPayments}
        onSave={handleSaveExtra}
        currencySymbol={profile?.preferred_currency || "£"}
      />
    </MainLayout>
  );
}