import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/">
        <Button variant="outline" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">What is this service about?</h2>
        <p>This service helps you manage your debts effectively with personalized strategies.</p>

        <h2 className="text-2xl font-semibold">How can I get started?</h2>
        <p>You can get started by signing up and accessing the planner tool.</p>

        <h2 className="text-2xl font-semibold">Is there a cost associated?</h2>
        <p>We offer a free trial period, after which you can choose a subscription plan that suits you.</p>

        <h2 className="text-2xl font-semibold">Can I cancel my subscription?</h2>
        <p>Yes, you can cancel your subscription at any time through your account settings.</p>
      </div>
    </div>
  );
};

export default FAQ;
