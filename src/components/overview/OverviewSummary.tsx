import { motion } from "framer-motion";
import { SummaryCard } from "./SummaryCard";
import { useDebts } from "@/hooks/use-debts";
import { calculatePayoffTime } from "@/lib/paymentCalculator";

export const OverviewSummary = () => {
  const { debts, profile } = useDebts();
  
  const calculateDebtSummary = () => {
    if (!debts || !profile) return null;
    
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const monthlyPayment = profile.monthly_payment || 0;
    
    // Group debts by category
    const debtsByCategory = debts.reduce((acc, debt) => {
      const category = debt.category || 'Other';
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          count: 0,
          avgInterestRate: 0,
          monthlyPayment: 0,
          maxMonths: 0
        };
      }
      
      acc[category].total += debt.balance;
      acc[category].count += 1;
      acc[category].avgInterestRate += debt.interest_rate;
      acc[category].monthlyPayment += debt.minimum_payment;
      
      const payoffMonths = calculatePayoffTime(debt, debt.minimum_payment);
      acc[category].maxMonths = Math.max(acc[category].maxMonths, payoffMonths);
      
      return acc;
    }, {} as Record<string, {
      total: number;
      count: number;
      avgInterestRate: number;
      monthlyPayment: number;
      maxMonths: number;
    }>);

    // Calculate averages and format data for display
    return Object.entries(debtsByCategory).map(([category, data]) => ({
      title: category,
      writtenOff: `${profile.preferred_currency}${data.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      monthlyCost: `${profile.preferred_currency}${data.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      oneOffCost: `${(data.avgInterestRate / data.count).toFixed(1)}%`,
      months: data.maxMonths === Infinity ? 'N/A' : data.maxMonths
    }));
  };

  const summaryData = calculateDebtSummary();

  if (!summaryData || summaryData.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Debt Summary</h2>
        <p className="text-gray-600">No debts added yet. Add your first debt to see the summary.</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Debt Summary</h2>
      
      {summaryData.map((data, index) => (
        <SummaryCard
          key={index}
          title={data.title}
          writtenOff={data.writtenOff}
          monthlyCost={data.monthlyCost}
          oneOffCost={data.oneOffCost}
          months={data.months}
        />
      ))}
    </motion.section>
  );
};