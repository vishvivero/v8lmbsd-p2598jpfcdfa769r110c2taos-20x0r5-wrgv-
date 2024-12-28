import { AddDebtForm } from "@/components/AddDebtForm";
import { DebtTable } from "@/components/DebtTable";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { useState, useMemo } from "react";
import { Debt, Strategy, strategies, formatCurrency } from "@/lib/strategies";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";

const Planner = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  const totalMinimumPayments = useMemo(() => {
    return debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  }, [debts]);

  const extraPayment = useMemo(() => {
    return Math.max(0, monthlyPayment - totalMinimumPayments);
  }, [monthlyPayment, totalMinimumPayments]);

  const handleAddDebt = (newDebt: Omit<Debt, "id">) => {
    const debt: Debt = {
      ...newDebt,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDebts([...debts, debt]);
  };

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
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Debt</h2>
          <AddDebtForm onAddDebt={handleAddDebt} />
        </motion.section>

        {debts.length > 0 && (
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
                    value={formatCurrency(totalMinimumPayments)}
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
                      Monthly payment must be at least {formatCurrency(totalMinimumPayments)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Extra Payment</label>
                  <Input
                    value={formatCurrency(extraPayment)}
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
              <DebtTable debts={debts} />
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