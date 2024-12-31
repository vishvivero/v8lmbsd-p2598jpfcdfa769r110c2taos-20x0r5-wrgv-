import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewStepProps {
  userName?: string;
  totalDebt: number;
  monthlyPayment: number;
  selectedStrategy: string;
  onCommit: () => void;
  currencySymbol?: string;
}

export const ReviewStep = ({
  userName = "there",
  totalDebt,
  monthlyPayment,
  selectedStrategy,
  onCommit,
  currencySymbol = "$"
}: ReviewStepProps) => {
  const { toast } = useToast();

  const handleCommit = () => {
    toast({
      title: "🎉 Achievement Unlocked!",
      description: "Debt Fighter: You've taken the first step towards financial freedom!",
      duration: 5000,
    });
    onCommit();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 p-6"
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
          You just took a big step, {userName}! 👏
        </h2>
        <p className="text-xl text-muted-foreground">
          Here's what's gonna happen next:
        </p>
      </div>

      <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Step 1
            </h3>
            <p className="text-gray-600">
              Every day when your commitment is due, you'll receive a WhatsApp message from us at 6pm.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Step 2
            </h3>
            <p className="text-gray-600">
              You'll need to verify that you took action by clicking YES or NO within 24 hours of receiving the message.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Step 3
            </h3>
            <p className="text-gray-600">
              You'll get notified once you succeed or fail your commitment. If you fail, you'll be charged $2 USD for charity.
            </p>
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-gray-500">
        If you need any help, please reach out to:
        <a href="mailto:hello@commitly.app" className="text-primary ml-1 hover:underline">
          hello@commitly.app
        </a>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          className="w-full max-w-md text-lg py-6"
          onClick={handleCommit}
        >
          Let's begin my journey!
        </Button>
      </div>
    </motion.div>
  );
};