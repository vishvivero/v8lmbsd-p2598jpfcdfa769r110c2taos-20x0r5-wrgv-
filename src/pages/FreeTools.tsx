import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FreeTools = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/">
        <Button variant="outline" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <h1 className="text-4xl font-bold mb-6">Free Tools</h1>
      <p className="text-lg text-gray-700 mb-4">
        Explore our collection of free tools designed to help you manage your finances effectively.
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Debt Repayment Calculator</li>
        <li>Budgeting Tool</li>
        <li>Expense Tracker</li>
      </ul>
      <p className="text-lg text-gray-700">
        These tools are here to assist you on your journey to financial freedom. Start using them today!
      </p>
    </div>
  );
};

export default FreeTools;
