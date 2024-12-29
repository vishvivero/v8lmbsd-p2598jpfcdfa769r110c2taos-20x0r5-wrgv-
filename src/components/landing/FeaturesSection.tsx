import { motion } from "framer-motion";
import { Target, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Set Your Goals",
    description: "Define your financial objectives, and our platform will guide you to the most effective debt repayment strategy.",
  },
  {
    icon: Shield,
    title: "Track Progress",
    description: "Monitor your payments, interest saved, and payoff timelines with detailed insights and visual projections.",
  },
  {
    icon: TrendingUp,
    title: "Achieve Freedom",
    description: "Eliminate your debt step-by-step with tailored strategies and practical tools to keep you on track.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it Works
          </h2>
          <p className="text-xl text-gray-600">
            Simplifying your journey to financial freedom in three easy steps:
          </p>
        </motion.div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col md:flex-row items-center gap-6 relative"
            >
              {/* Connecting line */}
              {index < features.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
              )}
              
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;