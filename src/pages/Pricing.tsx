import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingCard } from "@/components/pricing/PricingCard";
import { motion } from "framer-motion";

const Pricing = () => {
  const basicFeatures = [
    "Basic debt tracking (cannot save debts)",
    "Simple payment calculator",
    "Standard charts and graphs",
  ];

  const proFeatures = [
    "Everything in Basic",
    "Save debts in your profile",
    "Save monthly payment preferences",
    "Save currency preferences",
    "Advanced debt strategies",
    "Priority email support",
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <PricingHeader />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Basic"
            description="Perfect for getting started"
            price="Free"
            period="/forever"
            features={basicFeatures}
            badge="Current"
            delay={0.1}
          />

          <PricingCard
            title="Pro"
            description="For serious debt management"
            price="£4.99"
            period="/month"
            features={proFeatures}
            badge="Free during Beta"
            isPro
            delay={0.2}
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
  );
};

export default Pricing;