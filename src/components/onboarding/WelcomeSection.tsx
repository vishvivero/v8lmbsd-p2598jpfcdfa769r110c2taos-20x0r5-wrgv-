import { motion } from "framer-motion";

export const WelcomeSection = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome to Your Debt-Free Journey
        </h1>
        <p className="text-xl text-gray-600">
          Let's start by understanding your current financial situation.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg"
      >
        <p className="text-2xl font-semibold text-gray-900">
          You are one step away from setting a plan
        </p>
      </motion.div>
    </div>
  );
};