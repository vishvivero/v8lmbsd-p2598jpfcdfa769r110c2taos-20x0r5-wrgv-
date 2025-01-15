import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const NoDebtsMessage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="inline-block p-4 bg-emerald-50 rounded-full"
      >
        <Plus className="w-12 h-12 text-emerald-600" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900">No Debts Added Yet!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Start tracking your debts to begin your journey to financial freedom. Add your first debt to see how Debtfreeo can help you become debt-free faster.
      </p>
      <Button 
        onClick={() => navigate('/planner')}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        Add Your First Debt
      </Button>
    </motion.div>
  );
};