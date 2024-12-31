import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PhaseFiveProps {
  onComplete: () => void;
}

export const PhaseFive = ({ onComplete }: PhaseFiveProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.div
          className="flex justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <CheckCircle className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-3xl font-bold">
          You're All Set! 🎉
        </h2>
        <p className="text-xl text-gray-600">
          Here's what happens next:
        </p>
      </div>

      <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Your Personal Dashboard
            </h3>
            <p className="text-gray-600">
              Access your customized debt payoff plan and track your progress in real-time.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Smart Notifications
            </h3>
            <p className="text-gray-600">
              Get reminders and updates to help you stay on track with your payments.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievement System
            </h3>
            <p className="text-gray-600">
              Earn badges and celebrate milestones as you progress toward becoming debt-free.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          className="w-full max-w-md text-lg py-6"
          onClick={onComplete}
        >
          Take Me to My Dashboard
        </Button>
      </div>
    </motion.div>
  );
};