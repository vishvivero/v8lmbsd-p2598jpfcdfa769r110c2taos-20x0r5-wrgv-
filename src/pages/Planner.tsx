import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddDebtForm } from "@/components/AddDebtForm";
import { DebtTable } from "@/components/DebtTable";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { PaymentDetails } from "@/components/PaymentDetails";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { Strategy, strategies } from "@/lib/strategies";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useDebts } from "@/hooks/use-debts";
import { Debt } from "@/lib/types/debt";

// Extract header section into a separate component
const PlannerHeader = ({ currencySymbol, setCurrencySymbol, handleSignOut }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div className="text-left">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Debt Freedom Planner
        </h1>
        <p className="text-gray-600 mt-2">
          Create your personalized debt payoff strategy
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Select
          value={currencySymbol}
          onValueChange={setCurrencySymbol}
        >
          <SelectTrigger className="w-[120px] bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800 hover:bg-white/90">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg">
            <SelectItem value="£">GBP (£)</SelectItem>
            <SelectItem value="$">USD ($)</SelectItem>
            <SelectItem value="€">EUR (€)</SelectItem>
            <SelectItem value="¥">JPY (¥)</SelectItem>
            <SelectItem value="₹">INR (₹)</SelectItem>
          </SelectContent>
        </Select>
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
          className="hover:bg-destructive/10 text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </motion.div>
  );
};

const Planner = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [currencySymbol, setCurrencySymbol] = useState<string>('£');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { debts, isLoading, addDebt, updateDebt, deleteDebt, recordPayment } = useDebts();

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("preferred_currency")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading currency preference:", error);
        return;
      }

      if (data?.preferred_currency) {
        setCurrencySymbol(data.preferred_currency);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
      navigate("/");
    }
  };

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

  const handleAddDebt = async (newDebt: Omit<Debt, "id">) => {
    if (!user) return;
    await addDebt.mutateAsync(newDebt);
  };

  const handleUpdateDebt = async (updatedDebt: Debt) => {
    if (!user) return;
    await updateDebt.mutateAsync(updatedDebt);
  };

  const handleDeleteDebt = async (debtId: string) => {
    if (!user) return;
    await deleteDebt.mutateAsync(debtId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <PlannerHeader 
          currencySymbol={currencySymbol}
          setCurrencySymbol={handleCurrencyChange}
          handleSignOut={handleSignOut}
        />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Debt</h2>
          <AddDebtForm onAddDebt={handleAddDebt} currencySymbol={currencySymbol} />
        </motion.section>

        {debts && debts.length > 0 && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism rounded-xl p-6 shadow-lg"
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
              className="glassmorphism rounded-xl p-6 shadow-lg"
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
              className="glassmorphism rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Debts</h2>
              <DebtTable 
                debts={debts} 
                monthlyPayment={monthlyPayment}
                onUpdateDebt={handleUpdateDebt}
                onDeleteDebt={handleDeleteDebt}
                currencySymbol={currencySymbol}
                selectedStrategy={selectedStrategy.id}
              />
            </motion.section>

            <div className="grid grid-cols-1 gap-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glassmorphism rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payoff Projection</h2>
                <DebtChart
                  debts={debts}
                  monthlyPayment={monthlyPayment}
                  currencySymbol={currencySymbol}
                />
              </motion.section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;