import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { ArrowLeft, Target, TrendingUp, Brain, Heart } from "lucide-react";

const ProgressTracking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-28 pb-20">
        <Link to="/">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold">Progress Tracking Benefits</h1>
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">Goal Visualization</h2>
              <p className="text-gray-600">
                Tracking your debt payoff progress provides clear visualization of your goals and achievements. This visual representation helps maintain focus and motivation throughout your debt-free journey.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">Measurable Progress</h2>
              <p className="text-gray-600">
                Regular tracking allows you to see exactly how far you've come and how close you are to your goals. This quantifiable progress helps maintain momentum and adjust strategies when needed.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">Behavioral Change</h2>
              <p className="text-gray-600">
                The act of tracking creates awareness of spending habits and debt patterns. This awareness naturally leads to better financial decisions and lasting behavioral changes.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">Emotional Well-being</h2>
              <p className="text-gray-600">
                Seeing your debt decrease over time reduces financial anxiety and builds confidence. The positive reinforcement from tracking progress contributes to better mental and emotional well-being.
              </p>
            </div>
          </section>

          <div className="bg-white rounded-lg p-6 shadow-sm mt-8">
            <h2 className="text-2xl font-semibold mb-4">Long-term Benefits</h2>
            <p className="text-gray-600 mb-4">
              Progress tracking isn't just about monitoring numbers - it's about building lasting financial habits. By consistently tracking your debt payoff journey, you develop:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Better financial discipline</li>
              <li>Increased accountability</li>
              <li>Improved decision-making skills</li>
              <li>Greater financial awareness</li>
              <li>Sustainable money management habits</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressTracking;