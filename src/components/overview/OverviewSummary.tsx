import { motion } from "framer-motion";
import { SummaryCard } from "./SummaryCard";

export const OverviewSummary = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Summary</h2>
      
      <SummaryCard
        title="Individual Voluntary Arrangement (IVA)"
        writtenOff="£2000"
        monthlyCost="£90"
        oneOffCost="N/A"
        months={60}
      />
      
      <SummaryCard
        title="Debt Management Plan (DMP)"
        writtenOff="£0"
        monthlyCost="£200"
        oneOffCost="N/A"
        months={37}
      />
      
      <SummaryCard
        title="Bankruptcy"
        writtenOff="£6000"
        monthlyCost="N/A"
        oneOffCost="£680"
        months={12}
      />
      
      <SummaryCard
        title="Debt Relief Order (DRO)"
        writtenOff="£6000"
        monthlyCost="N/A"
        oneOffCost="£90"
        months={12}
      />
    </motion.section>
  );
};