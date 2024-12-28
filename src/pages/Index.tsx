import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Take Control of Your Financial Future
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Smart debt management isn't about quick fixes - it's about building better financial habits
            and making informed decisions.
          </p>
          <Button
            onClick={() => navigate("/planner")}
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-primary/50 transition-all"
            >
              <div className="text-primary mb-4 text-2xl">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-white/30 backdrop-blur-sm border border-gray-200"
              >
                <div className="text-secondary mb-3 text-xl">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const benefits = [
  {
    icon: "🎯",
    title: "Clear Financial Vision",
    description:
      "Understand your complete debt picture in one place and make informed decisions about your financial future.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    description:
      "Receive personalized recommendations based on your unique financial situation and goals.",
  },
  {
    icon: "📈",
    title: "Strategic Planning",
    description:
      "Choose from proven debt reduction strategies or create your own custom plan for becoming debt-free.",
  },
];

const features = [
  {
    icon: "📊",
    title: "Visual Progress Tracking",
    description: "Watch your debt decrease with interactive charts and visualizations.",
  },
  {
    icon: "🔄",
    title: "Multiple Strategies",
    description: "Compare different debt payoff methods to find what works best for you.",
  },
  {
    icon: "📱",
    title: "Easy to Use",
    description: "Simple, intuitive interface that makes debt management straightforward.",
  },
  {
    icon: "🎓",
    title: "Educational Resources",
    description: "Learn about financial management while working towards your goals.",
  },
];

export default Index;