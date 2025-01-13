import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { OverviewHeader } from "@/components/overview/OverviewHeader";
import { OverviewChart } from "@/components/overview/OverviewChart";
import { OverviewSummary } from "@/components/overview/OverviewSummary";
import { DebtScoreCard } from "@/components/overview/DebtScoreCard";
import { motion } from "framer-motion";

const Overview = () => {
  const [currencySymbol, setCurrencySymbol] = useState<string>('£');
  const { toast } = useToast();
  const { user } = useAuth();
  const { debts, isLoading, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();

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
  };

  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) ?? 0;

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
      <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
        <div className="container py-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Your Debt Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Track Your Progress Toward Financial Freedom
            </p>
          </motion.div>

          <DebtScoreCard />

          {debts && debts.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6"
              >
                <OverviewChart
                  debts={debts}
                  monthlyPayment={totalMinimumPayments}
                  currencySymbol={currencySymbol}
                  oneTimeFundings={oneTimeFundings}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6"
              >
                <OverviewSummary oneTimeFundings={oneTimeFundings} />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Overview;