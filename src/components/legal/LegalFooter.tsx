import { Link } from "react-router-dom";

export const LegalFooter = () => {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
      <Link to="/privacy" className="hover:text-primary">
        Privacy Policy
      </Link>
      <Link to="/terms" className="hover:text-primary">
        Terms of Service
      </Link>
      <Link to="/dpa" className="hover:text-primary">
        Data Processing Agreement
      </Link>
    </div>
  );
};