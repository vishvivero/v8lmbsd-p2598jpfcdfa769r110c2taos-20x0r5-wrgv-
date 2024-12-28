import { motion } from "framer-motion";
import { Rocket, Shield, Award } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Crush Your Debt - Fast!",
    description: "Step-by-step guide with actionable tips and strategies to help you regain control of your finances.",
  },
  {
    icon: Shield,
    title: "Personalized Strategies",
    description: "AI-powered advice tailored to your unique financial situation and goals.",
  },
  {
    icon: Award,
    title: "Trusted by Thousands",
    description: "Join countless others who have successfully eliminated their debt using our platform.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unlock the Secrets to Debt Elimination
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides personalized strategies to help you achieve financial freedom.
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
              whileHover={{ y: -5 }}
              className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;