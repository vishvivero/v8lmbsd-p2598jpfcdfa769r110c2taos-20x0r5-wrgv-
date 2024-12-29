import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PricingFeatures } from "./PricingFeatures";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Shield, Sparkles, Clock } from "lucide-react";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  badge?: string;
  isPro?: boolean;
  delay?: number;
}

export const PricingCard = ({
  title,
  description,
  price,
  period,
  features,
  badge,
  isPro = false,
  delay = 0,
}: PricingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    navigate("/planner");
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/planner");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-2xl p-8 shadow-sm border ${
        isPro ? "border-primary/20 relative overflow-hidden" : "border-gray-100"
      }`}
    >
      {isPro && (
        <>
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-primary/10 rounded-full" />
          <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/20 rounded-full" />
        </>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        {badge && <Badge variant={isPro ? "secondary" : "default"}>{badge}</Badge>}
      </div>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <PricingFeatures features={features} isPro={isPro} />
      {user ? (
        <Button 
          className="w-full" 
          variant={isPro ? "default" : "outline"}
          onClick={() => navigate("/planner")}
        >
          Go to Planner
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              variant={isPro ? "default" : "outline"}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl p-8">
            <DialogHeader>
              <DialogTitle>Start Your Journey</DialogTitle>
            </DialogHeader>
            <div className="mt-8">
              <AuthForm onSuccess={handleAuthSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Additional information below the button */}
      <div className="mt-6 space-y-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Free Pro Features During Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>Founded in the United Kingdom: Trust Built-In</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs">
            By pressing 'Get Started' you agree to our Legal Policies
          </span>
        </div>
      </div>
    </motion.div>
  );
};