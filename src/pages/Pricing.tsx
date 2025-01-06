import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { PricingPlan } from "@/components/pricing/PricingPlan";
import { Link } from "react-router-dom";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { CookieConsent } from "@/components/legal/CookieConsent";

const basicFeatures = [
  { text: "Basic debt tracking (cannot save debts)" },
  { text: "Simple payment calculator" },
  { text: "Standard charts and graphs" },
];

const proFeatures = [
  { text: "Everything in Basic" },
  { text: "Save debts in your profile" },
  { text: "Save monthly payment preferences" },
  { text: "Save currency preferences" },
  { text: "Advanced debt strategies" },
  { text: "Priority email support" },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome!",
      description: "Successfully signed in. Let's start planning your debt-free journey!",
    });
    navigate("/planner");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 w-full bg-gradient-to-br from-purple-50 to-blue-50 py-16 flex items-center">
        <div className="w-full container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your journey to financial freedom with our straightforward pricing plans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingPlan
              title="Basic"
              description="Perfect for getting started"
              badge="Current"
              price="Free"
              interval="/forever"
              features={basicFeatures}
              buttonText="Get Started"
              buttonVariant="outline"
              onAuthSuccess={handleAuthSuccess}
              isAuthenticated={!!user}
            />

            <PricingPlan
              title="Pro"
              description="For serious debt management"
              badge="Free during Beta"
              price="£4.99"
              interval="/month"
              features={proFeatures}
              buttonText="Try Pro for Free"
              badgeVariant="secondary"
              onAuthSuccess={handleAuthSuccess}
              isAuthenticated={!!user}
            />
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
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100 w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                Debtfreeo
              </Link>
              <p className="text-gray-600">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/tools" className="hover:text-primary transition-colors">
                    Free Tools
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <LegalFooter />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Debtfreeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default Pricing;