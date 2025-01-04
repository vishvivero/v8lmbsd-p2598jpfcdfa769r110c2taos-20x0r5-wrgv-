import { useState, useEffect } from "react";
import { useDebts } from "@/hooks/use-debts";
import { motion } from "framer-motion";
import { DebtTable } from "@/components/DebtTable";
import { DebtChart } from "@/components/debt/DebtChart";
import { DebtCategoryChart } from "@/components/debt/DebtCategoryChart";
import { AddDebtDialog } from "@/components/debt/AddDebtDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { strategies } from "@/lib/strategies";

const DebtList = () => {
  const [showAddDebtDialog, setShowAddDebtDialog] = useState(false);
  const [showDecimals, setShowDecimals] = useState(false);
  const { debts, isLoading, updateDebt, deleteDebt, profile } = useDebts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calculate payoff details
  const strategy = strategies[0]; // Default to first strategy
  const sortedDebts = strategy.calculate(debts || []);
  const payoffDetails = calculatePayoffDetails(
    sortedDebts,
    profile?.monthly_payment || 0,
    strategy
  );

  const currencySymbol = profile?.preferred_currency || '£';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Debts</h1>
        <Button
          onClick={() => setShowAddDebtDialog(true)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </div>

      {debts && debts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            No debts added yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start by adding your first debt to track your progress
          </p>
          <Button
            onClick={() => setShowAddDebtDialog(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Debt
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DebtTable 
              debts={debts || []}
              payoffDetails={payoffDetails}
              onUpdateDebt={updateDebt.mutate}
              onDeleteClick={(debt) => deleteDebt.mutate(debt.id)}
              showDecimals={showDecimals}
              currencySymbol={currencySymbol}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Debt by Name</h2>
                {debts && <DebtChart 
                  debts={debts} 
                  currencySymbol={currencySymbol} 
                  monthlyPayment={profile?.monthly_payment || 0}
                />}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Debt by Category</h2>
                {debts && <DebtCategoryChart 
                  debts={debts} 
                  currencySymbol={currencySymbol} 
                />}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <AddDebtDialog
        onAddDebt={debts?.addDebt.mutate}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};

export default DebtList;