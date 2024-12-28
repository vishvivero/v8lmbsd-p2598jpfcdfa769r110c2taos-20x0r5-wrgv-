import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Debtfreeo</h3>
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
            <p>&copy; 2024 Debtfreeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;