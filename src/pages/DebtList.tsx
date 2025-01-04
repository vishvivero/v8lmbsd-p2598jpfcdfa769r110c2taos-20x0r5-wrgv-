import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { useDebts } from "@/hooks/use-debts";
import { Debt } from "@/lib/types/debt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DebtCard } from "@/components/debt/DebtCard";
import { DebtChart } from "@/components/debt/DebtChart";
import { AddDebtDialog } from "@/components/debt/AddDebtDialog";
import { motion } from "framer-motion";

const DebtList = () => {
  const { debts, isLoading, deleteDebt, addDebt } = useDebts();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  const activeDebts = debts?.filter(debt => debt.balance > 0) || [];
  const completedDebts = debts?.filter(debt => debt.balance === 0) || [];

  const filteredActiveDebts = activeDebts.filter(debt => 
    debt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedDebts = completedDebts.filter(debt => 
    debt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculatePayoffYears = (currentDebt: Debt) => {
    const monthlyInterest = currentDebt.interest_rate / 1200;
    const monthlyPayment = currentDebt.minimum_payment;
    const balance = currentDebt.balance;
    
    if (monthlyPayment <= balance * monthlyInterest) {
      return "Never";
    }

    const months = Math.log(monthlyPayment / (monthlyPayment - balance * monthlyInterest)) / Math.log(1 + monthlyInterest);
    return `${Math.ceil(months / 12)} years`;
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
        <div className="container py-8 h-[calc(100vh-2rem)] flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Debt Management</h1>
              <p className="text-gray-600 mt-1">Track and manage all your debts in one place</p>
            </div>
            <AddDebtDialog 
              onAddDebt={addDebt.mutateAsync} 
              currencySymbol={debts?.[0]?.currency_symbol || '£'} 
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 flex flex-col"
            >
              <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <Input
                    type="search"
                    placeholder="Search debts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Tabs defaultValue="active" className="w-full h-[calc(100%-4rem)] flex flex-col">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">
                      Active Debts ({activeDebts.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedDebts.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="flex-1 overflow-y-auto space-y-4">
                    {filteredActiveDebts.map((debt) => (
                      <DebtCard
                        key={debt.id}
                        debt={debt}
                        onDelete={deleteDebt.mutate}
                        calculatePayoffYears={calculatePayoffYears}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="completed" className="flex-1 overflow-y-auto space-y-4">
                    {filteredCompletedDebts.map((debt) => (
                      <DebtCard
                        key={debt.id}
                        debt={debt}
                        onDelete={deleteDebt.mutate}
                        calculatePayoffYears={calculatePayoffYears}
                      />
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-8"
            >
              <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 h-auto min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Debt by Name</h2>
                {debts && <DebtChart 
                  debts={debts} 
                  currencySymbol={debts[0]?.currency_symbol || '£'} 
                  monthlyPayment={0}
                />}
              </div>

              <div className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 h-auto min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Debt by Name</h2>
                {debts && <DebtChart 
                  debts={debts} 
                  currencySymbol={debts[0]?.currency_symbol || '£'} 
                  monthlyPayment={0}
                />}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DebtList;