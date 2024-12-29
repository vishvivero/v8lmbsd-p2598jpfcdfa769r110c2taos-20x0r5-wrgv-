import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Pricing = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/">
        <Button variant="outline" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <h1 className="text-4xl font-bold mb-6">Pricing</h1>
      <p className="text-lg text-gray-700 mb-4">Explore our pricing plans and find the best option for you.</p>
      <ul className="list-disc pl-5">
        <li className="mb-2">Basic Plan: $10/month</li>
        <li className="mb-2">Pro Plan: $20/month</li>
        <li className="mb-2">Enterprise Plan: Contact us for pricing</li>
      </ul>
      <p className="text-sm text-gray-500">All plans come with a 14-day free trial.</p>
    </div>
  );
};

export default Pricing;
