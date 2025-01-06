import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sampleDebt, setSampleDebt] = useState({
    name: "Credit Card",
    balance: 5000,
    payment: 200
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(5);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white rounded-xl">
        <div className="relative">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="p-6">
            <OnboardingProgress currentStep={currentStep} totalSteps={5} />
          </div>

          <div className="px-8 pb-8">
            {/* Welcome Screen */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Welcome to Debtfreeo!
                  </h2>
                  <p className="text-xl text-gray-600 max-w-md mx-auto">
                    Your journey to financial freedom starts here. Let us guide you step-by-step.
                  </p>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Understanding the Problem */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Why Track Your Debts?
                  </h2>
                  <div className="py-8">
                    <img 
                      src="/lovable-uploads/6ce71a6f-54b3-413b-b53f-293d8a70fb0f.png" 
                      alt="Debt tracking illustration"
                      className="mx-auto h-48 object-contain"
                    />
                  </div>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Unmanaged debts can feel overwhelming. Debtfreeo helps you organize your debts, 
                    reduce stress, and save money through smart repayment strategies.
                  </p>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <div className="space-x-4">
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-500"
                    >
                      Skip Tour
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="gap-2"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Introducing the Solution */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Meet Debtfreeo – Your Financial Companion
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                      {
                        title: "Track All Debts",
                        description: "Keep all your debts organized in one place"
                      },
                      {
                        title: "Smart Payments",
                        description: "Automated payment schedules and reminders"
                      },
                      {
                        title: "Visual Progress",
                        description: "Watch your debt decrease with visual tracking"
                      }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="p-6 rounded-lg bg-gray-50 text-center space-y-2"
                      >
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <div className="space-x-4">
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-500"
                    >
                      Skip Tour
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="gap-2"
                    >
                      Show Me How It Works <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Interactive Demo */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Quick Interactive Demo
                  </h2>
                  <p className="text-gray-600">
                    See how Debtfreeo helps you track and manage your debts
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Sample Debt</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{sampleDebt.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Balance</p>
                        <p className="font-medium">£{sampleDebt.balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Payment</p>
                        <p className="font-medium">£{sampleDebt.payment.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Progress Preview</h3>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: "40%" }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Estimated payoff in 2 years and 3 months
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <div className="space-x-4">
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-500"
                    >
                      Skip Tour
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="gap-2"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sign Up */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Your Debt-Free Journey Awaits
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Sign up now to access your personalized dashboard, track your progress, 
                    and receive valuable insights on your journey to financial freedom.
                  </p>
                </div>

                <div className="mt-8">
                  <AuthForm 
                    onSuccess={() => {
                      onOpenChange(false);
                      navigate("/overview");
                      toast({
                        title: "Welcome to Debtfreeo!",
                        description: "Your account has been created successfully.",
                      });
                    }}
                    defaultView="signup"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};