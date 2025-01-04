import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { useDebts } from "@/hooks/use-debts";
import { Debt } from "@/lib/types/debt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DebtCard } from "@/components/debt/DebtCard";
import { DebtChart } from "@/components/debt/DebtChart";
import { AddDebtDialog } from "@/components/debt/AddDebtDialog";

const DebtList = () => {
  const { debts, isLoading, deleteDebt } = useDebts();
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
      <div className="container py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Debts</h1>
            <p className="text-gray-600">Manage all your debts in one place</p>
          </div>
          <AddDebtDialog onAddDebt={addDebt.mutateAsync} currencySymbol={debts?.[0]?.currency_symbol || '£'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Input
                  type="search"
                  placeholder="Search debts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Tabs defaultValue="active" className="w-full">
                <TabsList>
                  <TabsTrigger value="active">
                    Debts in progress ({activeDebts.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Debts completed ({completedDebts.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {filteredActiveDebts.map((debt) => (
                    <DebtCard
                      key={debt.id}
                      debt={debt}
                      onDelete={deleteDebt.mutate}
                      calculatePayoffYears={calculatePayoffYears}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
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
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Balance by debt</h2>
              {debts && <DebtChart debts={debts} currencySymbol={debts[0]?.currency_symbol || '£'} />}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DebtList;