import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import { Debt } from "@/lib/types/debt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DebtList = () => {
  const { debts, isLoading, deleteDebt } = useDebts();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#FF0000'];

  const pieChartData = debts?.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    color: COLORS[index % COLORS.length]
  })) || [];

  const calculatePayoffYears = (debt: Debt) => {
    const monthlyInterest = debt.interest_rate / 1200;
    const monthlyPayment = debt.minimum_payment;
    const balance = debt.balance;
    
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
          <Button 
            onClick={() => navigate("/planner")} 
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add debt
          </Button>
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
                    <motion.div
                      key={debt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        debt.balance > 10000 ? 'border-red-200 bg-red-50' :
                        debt.balance > 5000 ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{debt.name}</h3>
                          <div className="flex gap-6 text-sm text-gray-600 mt-1">
                            <span>Minimum: {debt.currency_symbol}{debt.minimum_payment}</span>
                            <span>APR: {debt.interest_rate}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/planner/debt/${debt.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDebt.mutate(debt.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Balance: {debt.currency_symbol}{debt.balance}</span>
                          <span>Paid off in {calculatePayoffYears(debt)}</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {filteredCompletedDebts.map((debt) => (
                    <motion.div
                      key={debt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-green-200 bg-green-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{debt.name}</h3>
                          <p className="text-sm text-green-600">Paid off!</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Balance by debt</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${debt.currency_symbol}${value}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieChartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DebtList;