import { motion } from "framer-motion";

export const PricingHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16 mt-16"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Simple, Transparent Pricing
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Start your journey to financial freedom with our straightforward pricing plans
      </p>
    </motion.div>
  );
};