import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { CheckCircle2, Rocket, Award, Shield, Timer } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Eliminate Your Debt and Unlock{" "}
            <span className="text-primary">Financial Freedom</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't let debt control your life. Take the first step towards financial freedom with our AI-powered debt elimination strategies.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/planner">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle2, text: "Regain control of your finances" },
              { icon: Shield, text: "Build a solid financial foundation" },
              { icon: Award, text: "Live a debt-free life" },
              { icon: Timer, text: "See results faster than ever" },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <benefit.icon className="w-12 h-12 text-primary mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock the Secrets to Debt Elimination</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides personalized strategies to help you achieve financial freedom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
            >
              <Rocket className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Crush Your Debt - Fast!</h3>
              <p className="text-gray-600">
                Step-by-step guide with actionable tips and strategies to help you regain control of your finances.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
            >
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Strategies</h3>
              <p className="text-gray-600">
                AI-powered advice tailored to your unique financial situation and goals.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
            >
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3>
              <p className="text-gray-600">
                Join countless others who have successfully eliminated their debt using our platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Take the First Step Towards Financial Freedom
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't wait any longer to start your journey toward a debt-free life. Get started today and unlock the financial freedom you deserve.
          </p>
          <Link to="/planner">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Journey Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Debt Strategist</h3>
              <p className="text-gray-400">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/debt-strategies" className="hover:text-white transition-colors">
                    Debt Strategies
                  </Link>
                </li>
                <li>
                  <Link to="/progress-tracking" className="hover:text-white transition-colors">
                    Progress Tracking
                  </Link>
                </li>
                <li>
                  <Link to="/planner" className="hover:text-white transition-colors">
                    Debt Planner
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Facebook</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Debt Strategist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
