import { motion } from "framer-motion";
import { SummaryCard } from "./SummaryCard";
import { useDebts } from "@/hooks/use-debts";
import { calculatePayoffTime } from "@/lib/paymentCalculator";
import { useEffect, useState } from "react";

export const OverviewSummary = () => {
  const { debts, profile } = useDebts();
  const [summaryData, setSummaryData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!debts || !profile) {
      console.log("No debts or profile data available");
      setSummaryData([]);
      return;
    }
    
    console.log("Recalculating debt summary with currency:", profile.preferred_currency);
    
    const newSummaryData = debts.map(debt => ({
      id: debt.id,
      title: debt.name,
      writtenOff: `${profile.preferred_currency}${debt.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      monthlyCost: `${profile.preferred_currency}${debt.minimum_payment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      oneOffCost: `${debt.interest_rate.toFixed(1)}%`,
      months: calculatePayoffTime(debt, debt.minimum_payment) === Infinity ? 'N/A' : calculatePayoffTime(debt, debt.minimum_payment)
    }));
    
    setSummaryData(newSummaryData);
  }, [debts, profile, profile?.preferred_currency]);

  if (!summaryData || summaryData.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#107A57]">Debt Summary</h2>
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
      <h2 className="text-2xl font-semibold mb-6 text-[#107A57]">Debt Summary</h2>
      
      {summaryData.map((data) => (
        <SummaryCard
          key={data.id}
          id={data.id}
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