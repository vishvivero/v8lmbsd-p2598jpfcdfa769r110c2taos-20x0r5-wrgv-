import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

const DebtStrategies = () => {
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
          <h1 className="text-4xl font-bold">Debt Elimination Strategies</h1>
          
          <section className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Debt Snowball Method</h2>
              <p className="text-gray-600 mb-4">
                Developed by Dave Ramsey in the 1990s, the debt snowball method is a debt reduction strategy that suggests paying off debt from smallest to largest, gaining momentum as each balance is paid off.
              </p>
              <p className="text-gray-600">
                The psychological benefit of quick wins makes this method particularly effective for those who are motivated by seeing immediate progress.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Debt Avalanche Method</h2>
              <p className="text-gray-600 mb-4">
                This mathematically optimal approach focuses on paying off debts with the highest interest rates first. While its origins are rooted in financial mathematics, it gained popularity through financial advisors and economists.
              </p>
              <p className="text-gray-600">
                This method saves the most money in interest payments over time, making it ideal for those who prefer a purely mathematical approach.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Debt Consolidation</h2>
              <p className="text-gray-600 mb-4">
                Dating back to the 1960s when credit cards became widespread, debt consolidation involves combining multiple debts into a single loan, often with a lower interest rate.
              </p>
              <p className="text-gray-600">
                This strategy simplifies payment management and can reduce overall interest costs, though it requires careful consideration of fees and terms.
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default DebtStrategies;