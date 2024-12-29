import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Target, 
  Clock, 
  TrendingUp 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />

      {/* Why Choose Debtfreeo Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Debtfreeo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take control of your financial future with a platform designed to simplify your debt repayment journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Personalized Strategies",
                description: "Choose from repayment methods like Avalanche, Snowball, or Balance Ratio to suit your financial needs and goals."
              },
              {
                icon: BarChart3,
                title: "Clear Payment Plans",
                description: "Easily track your monthly payments, total interest saved, and payoff dates in a single, intuitive dashboard."
              },
              {
                icon: PieChart,
                title: "Comprehensive Insights",
                description: "Get a detailed breakdown of your debts, including interest rates, total payments, and timelines for repayment."
              },
              {
                icon: LineChart,
                title: "Visual Progress Tracking",
                description: "Stay motivated with dynamic charts that show how your debts will decrease over time."
              },
              {
                icon: Clock,
                title: "Flexible Input Options",
                description: "Add and manage multiple debts seamlessly, with customizable payment details for better planning."
              },
              {
                icon: TrendingUp,
                title: "Built for Simplicity",
                description: "An easy-to-use interface that focuses on clarity and efficiency, making debt management stress-free."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-800 font-medium">
              Start your journey to financial freedom with Debtfreeo today!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Debtfreeo</h3>
              <p className="text-gray-600">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Free Tools (Coming Soon)</li>
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

export default Index;