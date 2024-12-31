import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandClap } from "lucide-react";

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
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <HandClap className="w-12 h-12 text-primary animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold">
          Almost there, {userName}!
        </h2>
        <p className="text-xl text-muted-foreground">
          Here's your summary:
        </p>
      </div>

      <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
        <div className="space-y-4">
          <p className="text-lg">
            I commit to paying {currencySymbol}{monthlyPayment} monthly towards my total debt of {currencySymbol}{totalDebt}.
          </p>
          <p className="text-lg">
            Using the {selectedStrategy} strategy to become debt-free faster.
          </p>
        </div>
      </Card>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          className="w-full max-w-md text-lg py-6"
          onClick={handleCommit}
        >
          Yes, I want to commit!
        </Button>
      </div>
    </div>
  );
};