import { Calculator, LineChart, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FreeTools = () => {
  const tools = [
    {
      title: "Amortisation Calculator",
      description: "Calculate your loan amortisation schedule with detailed monthly breakdowns.",
      icon: Calculator,
      comingSoon: true,
    },
    {
      title: "Interest Calculator",
      description: "Calculate interest payments and total costs for different types of loans.",
      icon: LineChart,
      comingSoon: true,
    },
    {
      title: "Loan Comparison Tool",
      description: "Compare different loan options to find the best rates and terms for you.",
      icon: PiggyBank,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Financial Tools</h1>
            <p className="text-lg text-gray-600">
              Explore our collection of free tools to help you make better financial decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                {tool.comingSoon ? (
                  <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                    Coming Soon
                  </span>
                ) : (
                  <Button asChild>
                    <Link to={`/tools/${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Try Now
                    </Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTools;