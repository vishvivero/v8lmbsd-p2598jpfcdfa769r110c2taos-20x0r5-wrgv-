import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Debtfreeo | Smart Debt Management & Repayment Planning Tool</title>
        <meta name="description" content="UK's trusted debt management platform. Track debts, explore Avalanche & Snowball repayment strategies, and achieve financial freedom. Free during beta phase." />
        <link rel="canonical" href="https://debtfreeo.com" />
      </Helmet>

      <Header />
      <main>
        <h1 className="sr-only">Debtfreeo - Smart Debt Management Platform</h1>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />

        {/* SEO-optimized content section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Smart Debt Management Made Simple
              </h2>
              <p className="text-gray-600 mb-6">
                Debtfreeo is the UK's leading debt management platform, designed to help you take control of your financial future. Our intelligent software combines proven debt repayment strategies like the Avalanche and Snowball methods with intuitive tracking tools to accelerate your journey to financial freedom.
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Why Choose Debtfreeo?
              </h3>
              <ul className="space-y-3">
                <li>✓ Free Pro Features During Beta Phase</li>
                <li>✓ Secure UK-Based Platform</li>
                <li>✓ Multiple Debt Repayment Strategies</li>
                <li>✓ Visual Progress Tracking</li>
                <li>✓ Personalized Payment Plans</li>
              </ul>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Start Your Debt-Free Journey Today
                </h3>
                <p className="text-gray-600">
                  Join thousands of users who are successfully managing their debt with Debtfreeo. Our platform is currently free during the beta phase, offering all premium features to help you achieve your financial goals faster.
                </p>
              </div>
            </div>
          </div>
        </section>
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
                <li>
                  <Link to="/pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
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

export default Index;
