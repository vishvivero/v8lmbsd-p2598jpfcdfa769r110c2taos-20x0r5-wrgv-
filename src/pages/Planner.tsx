import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddDebtForm } from "@/components/AddDebtForm";
import { DebtTable } from "@/components/DebtTable";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Strategy, strategies, formatCurrency } from "@/lib/strategies";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useDebts } from "@/hooks/use-debts";
import { Debt } from "@/lib/types/debt";

const Planner = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [currencySymbol, setCurrencySymbol] = useState<string>('£');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { debts, isLoading, addDebt, updateDebt, recordPayment } = useDebts();

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

  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimumPayment, 0) ?? 0;

  const extraPayment = Math.max(0, monthlyPayment - totalMinimumPayments);

  const handleAddDebt = async (newDebt: Omit<Debt, "id">) => {
    if (!user) return;
    await addDebt.mutateAsync(newDebt);
  };

  const handleUpdateDebt = async (updatedDebt: Debt) => {
    if (!user) return;
    await updateDebt.mutateAsync(updatedDebt);
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrencySymbol(newCurrency);
    if (user && monthlyPayment > 0) {
      await recordPayment.mutateAsync({
        total_payment: monthlyPayment,
        currency_symbol: newCurrency,
        user_id: user.id,
        payment_date: new Date().toISOString(),
      });
    }
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
              onValueChange={handleCurrencyChange}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Minimum Payments</label>
                  <Input
                    value={formatCurrency(totalMinimumPayments, currencySymbol)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Payment</label>
                  <Input
                    type="number"
                    min={totalMinimumPayments}
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    placeholder="Enter amount"
                    className={monthlyPayment < totalMinimumPayments ? "border-red-500" : ""}
                  />
                  {monthlyPayment < totalMinimumPayments && (
                    <p className="text-red-500 text-sm">
                      Monthly payment must be at least {formatCurrency(totalMinimumPayments, currencySymbol)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Extra Payment</label>
                  <Input
                    value={formatCurrency(extraPayment, currencySymbol)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glassmorphism rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Debts</h2>
              <DebtTable 
                debts={selectedStrategy.calculate(debts)} 
                monthlyPayment={monthlyPayment}
                onUpdateDebt={handleUpdateDebt}
                currencySymbol={currencySymbol}
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
                  debts={selectedStrategy.calculate(debts)}
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
