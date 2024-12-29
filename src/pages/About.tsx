import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/">
        <Button variant="outline" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
      
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        We are dedicated to helping you achieve your financial goals. Our team provides personalized strategies to help you eliminate debt and build a brighter financial future.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-lg text-gray-700 mb-4">
        Our mission is to empower individuals to take control of their finances through education and actionable strategies.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
      <p className="text-lg text-gray-700 mb-4">
        Our team consists of financial experts with years of experience in debt management and financial planning.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p className="text-lg text-gray-700 mb-4">
        If you have any questions or need assistance, feel free to reach out to us through our contact page.
      </p>
    </div>
  );
};

export default About;
