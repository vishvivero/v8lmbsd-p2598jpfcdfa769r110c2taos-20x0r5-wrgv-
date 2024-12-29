import Header from "@/components/Header";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Debtfreeo</h3>
              <p className="text-gray-600">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Free Tools (Coming Soon)</li>
                <li className="space-y-2">
                  <Link to="/pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      Basic - Free
                      <Badge>Current</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      Pro - £4.99/month
                      <Badge variant="secondary">Free during Beta</Badge>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <LegalFooter />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Debtfreeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default Layout;