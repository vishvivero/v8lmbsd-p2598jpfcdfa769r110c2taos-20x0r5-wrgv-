import { motion } from "framer-motion";
import { Target, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Set Your Goals",
    description: "Specify your financial goals and let our AI match you with the perfect debt elimination strategy.",
  },
  {
    icon: Shield,
    title: "Track Progress",
    description: "Get a curated set of recommendations and insights that match your debt elimination criteria.",
  },
  {
    icon: TrendingUp,
    title: "Achieve Freedom",
    description: "Successfully eliminate your debt with personalized strategies and ongoing support.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it works?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform simplifies debt elimination
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-primary/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;