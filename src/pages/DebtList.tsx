import { useState } from "react";
import { useDebts } from "@/hooks/use-debts";
import { DebtChart } from "@/components/debt/DebtChart";
import { AddDebtDialog } from "@/components/debt/AddDebtDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

const DebtList = () => {
  const { debts, isLoading, deleteDebt, addDebt, profile } = useDebts();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredDebts = debts?.filter((debt) =>
    debt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Your Debts</h1>
          <AddDebtDialog onAddDebt={addDebt.mutateAsync} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search debts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 flex-1">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Debt by Name</h2>
              {debts && (
                <DebtChart 
                  debts={debts} 
                  currencySymbol={debts[0]?.currency_symbol || '£'} 
                  monthlyPayment={profile?.monthly_payment || 0}
                />
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Debt List</h2>
              {filteredDebts && filteredDebts.length > 0 ? (
                <div className="space-y-4">
                  {filteredDebts.map((debt) => (
                    <div
                      key={debt.id}
                      className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{debt.name}</h3>
                          <p className="text-sm text-gray-500">
                            Balance: {debt.currency_symbol}
                            {debt.balance.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteDebt.mutate(debt.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No debts found</p>
                  <AddDebtDialog onAddDebt={addDebt.mutateAsync}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Debt
                    </Button>
                  </AddDebtDialog>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DebtList;