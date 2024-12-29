import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Pricing = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome!",
      description: "Successfully signed in. Let's start planning your debt-free journey!",
    });
    navigate("/planner");
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Basic</h2>
                <p className="text-gray-600 mt-1">Perfect for getting started</p>
              </div>
              <Badge>Current</Badge>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Free</span>
              <span className="text-gray-600">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Basic debt tracking (cannot save debts)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Simple payment calculator</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Standard charts and graphs</span>
              </li>
            </ul>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate("/planner")}
            >
              Get Started
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute -right-12 -top-12 w-24 h-24 bg-primary/10 rounded-full" />
            <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/20 rounded-full" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pro</h2>
                <p className="text-gray-600 mt-1">For serious debt management</p>
              </div>
              <Badge variant="secondary">Free during Beta</Badge>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">£4.99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Everything in Basic</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Save debts in your profile</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Save monthly payment preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Save currency preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Advanced debt strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-600">Priority email support</span>
              </li>
            </ul>
            <Button 
              className="w-full"
              onClick={() => setShowAuthDialog(true)}
            >
              Try Pro for Free
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            100% Free During Beta
          </h3>
          <p className="text-gray-600">
            Early adopters get access to all Pro features for free during our beta period. 
            Join now to lock in these benefits and help shape the future of Debtfreeo.
          </p>
        </motion.div>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-xl p-8">
          <div className="mt-8">
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;