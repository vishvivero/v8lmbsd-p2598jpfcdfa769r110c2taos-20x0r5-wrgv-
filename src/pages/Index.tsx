import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section - Adjusted padding for header */}
      <section className="container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Take Control of Your{" "}
            <span className="text-primary">Financial Freedom</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart debt management powered by AI. Transform your financial habits and
            achieve debt freedom with personalized strategies.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/planner">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and strategies based on your unique
                financial situation.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Smart Strategies</h3>
              <p className="text-gray-600">
                Choose from proven debt payoff methods or create your own custom
                strategy.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Visual Progress</h3>
              <p className="text-gray-600">
                Track your journey with interactive charts and celebrate your
                milestones.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">DebtFreedom</h3>
              <p className="text-gray-400">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI Recommendations</li>
                <li>Debt Strategies</li>
                <li>Progress Tracking</li>
                <li>Financial Education</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Guides</li>
                <li>Support</li>
                <li>FAQ</li>
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
            <p>&copy; 2024 DebtFreedom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;