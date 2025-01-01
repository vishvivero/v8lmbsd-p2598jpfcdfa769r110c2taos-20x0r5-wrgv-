import { motion } from "framer-motion";

export const WelcomeSection = () => {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-medium text-gray-900">
          Welcome to Your Debt-Free Journey
        </h1>
        <p className="text-lg text-gray-600">
          Let's start by understanding your current financial situation.
        </p>
      </motion.div>
    </div>
  );
};