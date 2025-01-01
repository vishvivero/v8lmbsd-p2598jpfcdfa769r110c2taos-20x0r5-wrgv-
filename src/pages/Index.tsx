import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { useTrackVisit } from "@/hooks/use-track-visit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Track page visit
  useTrackVisit();

  // Handle authentication state
  useEffect(() => {
    if (!loading && user) {
      console.log("User is authenticated:", user.id);
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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