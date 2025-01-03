import { useState, useEffect } from "react";
import { AddDebtForm } from "@/components/AddDebtForm";
import { DebtTableContainer } from "@/components/DebtTableContainer";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { PaymentDetails } from "@/components/PaymentDetails";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useDebts } from "@/hooks/use-debts";
import { supabase } from "@/integrations/supabase/client";
import { PlannerHeader } from "@/components/planner/PlannerHeader";
import { strategies } from "@/lib/strategies";
import { MainLayout } from "@/components/layout/MainLayout";

const Overview = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [currencySymbol, setCurrencySymbol] = useState<string>('£');
  const { toast } = useToast();
  const { user } = useAuth();
  const { debts, isLoading, addDebt, updateDebt, deleteDebt, recordPayment, profile } = useDebts();

  useEffect(() => {
    if (profile?.preferred_currency) {
      setCurrencySymbol(profile.preferred_currency);
    }
  }, [profile]);

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrencySymbol(newCurrency);
    
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ preferred_currency: newCurrency })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving currency preference:", error);
      toast({
        title: "Error",
        description: "Failed to save currency preference",
        variant: "destructive",
      });
      return;
    }

    if (monthlyPayment > 0) {
      await recordPayment.mutateAsync({
        total_payment: monthlyPayment,
        currency_symbol: newCurrency,
        user_id: user.id,
        payment_date: new Date().toISOString(),
      });
    }
  };

  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
          <PlannerHeader 
            currencySymbol={currencySymbol}
            onCurrencyChange={handleCurrencyChange}
          />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Debt</h2>
            <AddDebtForm onAddDebt={addDebt.mutateAsync} currencySymbol={currencySymbol} />
          </motion.section>

          {debts && debts.length > 0 && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Choose Your Strategy</h2>
                <StrategySelector
                  strategies={strategies}
                  selectedStrategy={selectedStrategy}
                  onSelectStrategy={setSelectedStrategy}
                />
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment Details</h2>
                <PaymentDetails
                  totalMinimumPayments={totalMinimumPayments}
                  monthlyPayment={monthlyPayment}
                  setMonthlyPayment={setMonthlyPayment}
                  currencySymbol={currencySymbol}
                />
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Debts</h2>
                <DebtTableContainer 
                  debts={debts} 
                  monthlyPayment={monthlyPayment}
                  onUpdateDebt={updateDebt.mutateAsync}
                  onDeleteDebt={deleteDebt.mutateAsync}
                  currencySymbol={currencySymbol}
                  selectedStrategy={selectedStrategy.id}
                />
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payoff Projection</h2>
                <DebtChart
                  debts={debts}
                  monthlyPayment={monthlyPayment}
                  currencySymbol={currencySymbol}
                />
              </motion.section>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Overview;
