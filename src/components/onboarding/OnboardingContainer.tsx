import { useState } from "react";
import { ReviewStep } from "./ReviewStep";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const OnboardingContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // These would come from your actual onboarding flow state
  const mockData = {
    userName: "Nick",
    totalDebt: 15000,
    monthlyPayment: 500,
    selectedStrategy: "avalanche",
    currencySymbol: "$"
  };

  const handleCommit = () => {
    // Handle the commitment - this would save to your database
    console.log("User committed to debt payment plan");
    
    // Show success toast with gamification element
    toast({
      title: "🌟 Level Up!",
      description: "You've unlocked the Debt Planning Pro badge!",
      duration: 5000,
    });
    
    // Navigate to the planner
    navigate("/planner");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10">
      {currentStep === 3 && (
        <ReviewStep
          userName={mockData.userName}
          totalDebt={mockData.totalDebt}
          monthlyPayment={mockData.monthlyPayment}
          selectedStrategy={mockData.selectedStrategy}
          currencySymbol={mockData.currencySymbol}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
};