import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebts } from "@/hooks/use-debts";
import { ChartBar, PiggyBank } from "lucide-react";

export const DebtComparison = () => {
  const { debts } = useDebts();

  const calculateAverageInterestRate = () => {
    if (!debts || debts.length === 0) return 0;
    const totalInterest = debts.reduce((sum, debt) => sum + debt.interest_rate, 0);
    return (totalInterest / debts.length).toFixed(2);
  };

  const calculateYearlyInterest = () => {
    if (!debts || debts.length === 0) return 0;
    return debts.reduce((sum, debt) => sum + (debt.balance * (debt.interest_rate / 100)), 0);
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#107A57]">YOUR DEBT SNAPSHOT</CardTitle>
          <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
            <ChartBar className="w-6 h-6 text-[#34D399]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debt Snapshot Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Debts</p>
            <p className="text-2xl font-bold text-gray-900">{debts?.length || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Average Interest Rate</p>
            <p className="text-2xl font-bold text-gray-900">{calculateAverageInterestRate()}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Yearly Interest Cost</p>
            <p className="text-2xl font-bold text-gray-900">£{calculateYearlyInterest().toFixed(2)}</p>
          </div>
        </div>

        {/* Potential Savings Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#107A57]">YOUR POTENTIAL SAVINGS</h3>
            <div className="w-10 h-10 bg-[#34D399]/10 rounded-full flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-[#34D399]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Potential Interest Saved</p>
              <p className="text-2xl font-bold text-green-600">£1,890</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Time Saved</p>
              <p className="text-2xl font-bold text-green-600">1.5 years</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};