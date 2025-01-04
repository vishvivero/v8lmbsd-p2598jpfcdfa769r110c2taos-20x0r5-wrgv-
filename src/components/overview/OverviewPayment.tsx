import { motion } from "framer-motion";
import { PaymentDetails } from "@/components/PaymentDetails";

interface OverviewPaymentProps {
  totalMinimumPayments: number;
  monthlyPayment: number;
  setMonthlyPayment: (amount: number) => void;
  currencySymbol: string;
}

export const OverviewPayment = ({
  totalMinimumPayments,
  monthlyPayment,
  setMonthlyPayment,
  currencySymbol,
}: OverviewPaymentProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment Details</h2>
      <PaymentDetails
        totalMinimumPayments={totalMinimumPayments}
        monthlyPayment={monthlyPayment}
        setMonthlyPayment={setMonthlyPayment}
        currencySymbol={currencySymbol}
      />
    </motion.section>
  );
};