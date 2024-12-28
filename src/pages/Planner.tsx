import { AddDebtForm } from "@/components/AddDebtForm";
import { DebtTable } from "@/components/DebtTable";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { AIRecommendations } from "@/components/AIRecommendations";
import { useState } from "react";
import { Debt, Strategy, strategies } from "@/lib/strategies";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Planner = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState(500);

  const handleAddDebt = (newDebt: Omit<Debt, "id">) => {
    const debt: Debt = {
      ...newDebt,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDebts([...debts, debt]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <h1 className="text-3xl font-bold tracking-tight">Debt Freedom Planner</h1>
            <p className="text-gray-600">
              Add your debts and let AI help you create the perfect payoff plan
            </p>
          </motion.div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-sm rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Add New Debt</h2>
          <AddDebtForm onAddDebt={handleAddDebt} />
        </motion.section>

        {debts.length > 0 && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Your Debts</h2>
              <DebtTable debts={debts} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Choose Your Strategy</h2>
              <StrategySelector
                strategies={strategies}
                selectedStrategy={selectedStrategy}
                onSelectStrategy={setSelectedStrategy}
              />
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <section className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Payoff Projection</h2>
                  <DebtChart
                    debts={selectedStrategy.calculate(debts)}
                    monthlyPayment={monthlyPayment}
                  />
                </section>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <section className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>
                  <AIRecommendations
                    debts={debts}
                    selectedStrategy={selectedStrategy}
                  />
                </section>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;