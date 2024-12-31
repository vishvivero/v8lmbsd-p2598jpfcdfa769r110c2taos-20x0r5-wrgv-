import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PhaseOne } from "./PhaseOne";
import { PhaseTwo } from "./PhaseTwo";
import { PhaseThree } from "./PhaseThree";
import { PhaseFour } from "./PhaseFour";
import { PhaseFive } from "./PhaseFive";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const OnboardingContainer = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    totalDebt: 0,
    monthlyPayment: 0,
    strategy: "",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhaseComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to complete onboarding",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          monthly_payment: onboardingData.monthlyPayment,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "🎉 Welcome aboard!",
        description: "Your debt-free journey begins now.",
      });
      
      navigate("/planner");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 1:
        return (
          <PhaseOne
            onNext={() => setCurrentPhase(2)}
          />
        );
      case 2:
        return (
          <PhaseTwo
            onNext={(data) => {
              setOnboardingData(prev => ({ ...prev, totalDebt: data.totalDebt }));
              setCurrentPhase(3);
            }}
          />
        );
      case 3:
        return (
          <PhaseThree
            onNext={(data) => {
              setOnboardingData(prev => ({ ...prev, monthlyPayment: data.monthlyPayment }));
              setCurrentPhase(4);
            }}
          />
        );
      case 4:
        return (
          <PhaseFour
            onNext={(data) => {
              setOnboardingData(prev => ({ ...prev, strategy: data.strategy }));
              setCurrentPhase(5);
            }}
          />
        );
      case 5:
        return (
          <PhaseFive
            onComplete={handlePhaseComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 py-12">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {renderCurrentPhase()}
        </AnimatePresence>
      </div>
    </div>
  );
};